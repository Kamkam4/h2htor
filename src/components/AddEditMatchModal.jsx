import React, { useState, useEffect } from 'react';
import { X, Trophy, Plus, Minus, Gamepad2, Calendar, Award, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { GAME_CATEGORIES } from '../data/initialMatches';

export default function AddEditMatchModal({
  isOpen,
  onClose,
  onSave,
  matchToEdit,
}) {
  const [tournament, setTournament] = useState('');
  const [date, setDate] = useState('');
  const [game, setGame] = useState('EA Sports FC 26');
  const [customGame, setCustomGame] = useState('');
  const [loozolloScore, setLoozolloScore] = useState(0);
  const [kamkamaScore, setKamkamaScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [mvp, setMvp] = useState('');

  useEffect(() => {
    if (matchToEdit) {
      setTournament(matchToEdit.tournament || '');
      setDate(matchToEdit.date || '');
      if (GAME_CATEGORIES.includes(matchToEdit.game)) {
        setGame(matchToEdit.game);
        setCustomGame('');
      } else {
        setGame('სხვა');
        setCustomGame(matchToEdit.game || '');
      }
      setLoozolloScore(Number(matchToEdit.loozolloScore) || 0);
      setKamkamaScore(Number(matchToEdit.kamkamaScore) || 0);
      setNotes(matchToEdit.notes || '');
      setMvp(matchToEdit.mvp || '');
    } else {
      // Default new match
      const today = new Date().toISOString().split('T')[0];
      setTournament('');
      setDate(today);
      setGame('EA Sports FC 26');
      setCustomGame('');
      setLoozolloScore(0);
      setKamkamaScore(0);
      setNotes('');
      setMvp('');
    }
  }, [matchToEdit, isOpen]);

  if (!isOpen) return null;

  // Determine prospective winner
  let calculatedWinner = 'draw';
  if (loozolloScore > kamkamaScore) calculatedWinner = 'loozollo';
  else if (kamkamaScore > loozolloScore) calculatedWinner = 'kamkama';

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalGame = game === 'სხვა' && customGame.trim() !== '' ? customGame.trim() : game;

    const payload = {
      id: matchToEdit ? matchToEdit.id : `m-${Date.now()}`,
      tournament: tournament.trim() || 'ჩემპიონატის მატჩი',
      date: date || new Date().toISOString().split('T')[0],
      game: finalGame || 'EA Sports FC 26',
      loozolloScore: Number(loozolloScore),
      kamkamaScore: Number(kamkamaScore),
      winner: calculatedWinner,
      notes: notes.trim(),
      mvp: mvp.trim(),
    };

    onSave(payload);
    sound.playVictory();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
      colors: calculatedWinner === 'loozollo' ? ['#06b6d4', '#3b82f6'] : calculatedWinner === 'kamkama' ? ['#f43f5e', '#fb923c'] : ['#eab308', '#ffffff']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display text-white">
                {matchToEdit ? "მატჩის რედაქტირება" : "ახალი მატჩის ჩაწერა"}
              </h3>
              <p className="text-[11px] text-slate-400">loozollo vs kamkama H2H შედეგი</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tournament & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                ტურნირი / ღონისძიება
              </label>
              <input
                type="text"
                required
                placeholder="მაგ: Tbilisi Masters - მე-5 ტური"
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                თარიღი
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          {/* Game Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              დისციპლინა / თამაში
            </label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/60 mb-2"
            >
              {GAME_CATEGORIES.filter(g => g !== "ყველა თამაში").map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {game === 'სხვა' && (
              <input
                type="text"
                placeholder="მიუთითეთ თამაშის სახელი..."
                value={customGame}
                onChange={(e) => setCustomGame(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            )}
          </div>

          {/* Score Arena Input */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="block text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              ანგარიში
            </span>

            <div className="flex items-center justify-around gap-4">
              
              {/* loozollo score */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wide mb-1">
                  loozollo
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLoozolloScore(Math.max(0, loozolloScore - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={loozolloScore}
                    onChange={(e) => setLoozolloScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 text-center py-1 text-2xl font-black font-display bg-slate-900 border border-cyan-500/40 rounded-xl text-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setLoozolloScore(loozolloScore + 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <span className="text-xl font-black text-slate-600">:</span>

              {/* kamkama score */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wide mb-1">
                  kamkama
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setKamkamaScore(Math.max(0, kamkamaScore - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={kamkamaScore}
                    onChange={(e) => setKamkamaScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 text-center py-1 text-2xl font-black font-display bg-slate-900 border border-rose-500/40 rounded-xl text-rose-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setKamkamaScore(kamkamaScore + 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Calculated Winner badge */}
            <div className="mt-3 text-center">
              <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                calculatedWinner === 'loozollo' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : calculatedWinner === 'kamkama'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                შედეგი: {calculatedWinner === 'loozollo' ? 'loozollo-ს მოგება' : calculatedWinner === 'kamkama' ? 'kamkama-ს მოგება' : 'ფრე'}
              </span>
            </div>
          </div>

          {/* Notes & MVP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                მატჩის MVP / მთავარი გმირი
              </label>
              <input
                type="text"
                placeholder="მაგ: loozollo (Vinicius)"
                value={mvp}
                onChange={(e) => setMvp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                შენიშვნა / კომენტარი
              </label>
              <input
                type="text"
                placeholder="მაგ: ოვერტაიმში მოგებული"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              {matchToEdit ? "ცვლილების შენახვა" : "მატჩის დამატება"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
