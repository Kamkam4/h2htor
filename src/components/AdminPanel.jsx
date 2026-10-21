import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  Gamepad2, 
  Trophy, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  RotateCcw, 
  Download, 
  Upload, 
  Flame,
  Minus,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { GAME_CATEGORIES } from '../data/initialMatches';

export default function AdminPanel({
  matches,
  isSupabaseConnected = false,
  onSaveMatch,
  onDeleteMatch,
  onBackToSite,
  onResetMatches,
  onClearMatches,
  onImportMatches,
}) {
  // Form State
  const [mode, setMode] = useState('upcoming'); // 'upcoming' | 'completed'
  const [editingId, setEditingId] = useState(null);

  const [tournament, setTournament] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('21:00');
  const [game, setGame] = useState('ტურნირის მატჩი');
  const [customGame, setCustomGame] = useState('');
  const [featured, setFeatured] = useState(true);
  const [loozolloScore, setLoozolloScore] = useState(0);
  const [kamkamaScore, setKamkamaScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [mvp, setMvp] = useState('');

  // Finish match modal state
  const [finishingMatch, setFinishingMatch] = useState(null);
  const [finishLoozolloScore, setFinishLoozolloScore] = useState(0);
  const [finishKamkamaScore, setFinishKamkamaScore] = useState(0);
  const [finishMvp, setFinishMvp] = useState('');
  const [finishNotes, setFinishNotes] = useState('');

  // JSON Import state
  const [showImportBox, setShowImportBox] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTournament('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('21:00');
    setGame('ტურნირის მატჩი');
    setCustomGame('');
    setFeatured(true);
    setLoozolloScore(0);
    setKamkamaScore(0);
    setNotes('');
    setMvp('');
  };

  // Start editing existing match
  const handleStartEdit = (m) => {
    sound.playClick();
    setEditingId(m.id);
    setMode(m.status || 'completed');
    setTournament(m.tournament || '');
    setDate(m.date || '');
    setTime(m.time || '21:00');
    setFeatured(m.featured === true);
    if (GAME_CATEGORIES.includes(m.game)) {
      setGame(m.game);
      setCustomGame('');
    } else {
      setGame('სხვა');
      setCustomGame(m.game || '');
    }
    setLoozolloScore(Number(m.loozolloScore) || 0);
    setKamkamaScore(Number(m.kamkamaScore) || 0);
    setNotes(m.notes || '');
    setMvp(m.mvp || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit main form
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalGame = game === 'სხვა' && customGame.trim() !== '' ? customGame.trim() : game;

    let winner = null;
    if (mode === 'completed') {
      if (Number(loozolloScore) > Number(kamkamaScore)) winner = 'loozollo';
      else if (Number(kamkamaScore) > Number(loozolloScore)) winner = 'kamkama';
      else winner = 'draw';
    }

    const payload = {
      id: editingId || `m-${Date.now()}`,
      status: mode,
      tournament: tournament.trim() || (mode === 'upcoming' ? 'დაგეგმილი მატჩი' : 'ჩემპიონატის მატჩი'),
      date: date || new Date().toISOString().split('T')[0],
      time: mode === 'upcoming' ? time : null,
      featured: mode === 'upcoming' ? Boolean(featured) : false,
      game: finalGame || 'ტურნირის მატჩი',
      loozolloScore: mode === 'completed' ? Number(loozolloScore) : null,
      kamkamaScore: mode === 'completed' ? Number(kamkamaScore) : null,
      winner,
      notes: notes.trim(),
      mvp: mode === 'completed' ? mvp.trim() : null,
    };

    onSaveMatch(payload);
    sound.playVictory();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.3 }
    });
    resetForm();
  };

  // Submit finish match
  const handleConfirmFinish = (e) => {
    e.preventDefault();
    if (!finishingMatch) return;

    let winner = 'draw';
    if (Number(finishLoozolloScore) > Number(finishKamkamaScore)) winner = 'loozollo';
    else if (Number(finishKamkamaScore) > Number(finishLoozolloScore)) winner = 'kamkama';

    const updated = {
      ...finishingMatch,
      status: 'completed',
      loozolloScore: Number(finishLoozolloScore),
      kamkamaScore: Number(finishKamkamaScore),
      winner,
      mvp: finishMvp.trim() || (winner === 'loozollo' ? 'loozollo' : winner === 'kamkama' ? 'kamkama' : ''),
      notes: finishNotes.trim() || finishingMatch.notes,
    };

    onSaveMatch(updated);
    sound.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: winner === 'loozollo' ? ['#06b6d4', '#3b82f6'] : ['#f43f5e', '#fb923c']
    });
    setFinishingMatch(null);
  };

  // Toggle Featured status on/off for an upcoming match
  const handleToggleFeatured = (match) => {
    sound.playClick();
    const nextFeatured = !match.featured;
    onSaveMatch({
      ...match,
      featured: nextFeatured,
    });
  };

  // Lists
  const upcomingList = matches.filter(m => m.status === 'upcoming');
  const completedList = matches.filter(m => m.status !== 'upcoming');

  const handleDownload = () => {
    sound.playClick();
    const blob = new Blob([JSON.stringify(matches, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importJson);
      if (!Array.isArray(parsed)) throw new Error('მასივი უნდა იყოს');
      onImportMatches(parsed);
      sound.playVictory();
      setShowImportBox(false);
      setImportJson('');
    } catch (e) {
      setImportError('არასწორი JSON ფორმატი: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 py-5 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onBackToSite();
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>საიტზე დაბრუნება</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white font-display truncate">
                  ადმინ პანელი
                </span>
                <span className="hidden xs:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  მართვა
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                მატჩების დამატება & Upcoming
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {isSupabaseConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] font-medium" title="მონაცემები ამჟამად ინახება ლოკალურად">
                LocalStorage Mode
              </span>
            )}
            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs font-bold text-amber-400">
              ⏳ {upcomingList.length} დაგეგმილი
            </span>
            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs font-bold text-emerald-400">
              🏆 {completedList.length} დასრულებული
            </span>
          </div>
        </div>

        {/* Add / Edit Form Card */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 bg-gradient-to-b from-slate-900/90 via-[#0c101c] to-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-display text-white">
                {editingId ? "მატჩის რედაქტირება" : "ახალი მატჩის დამატება"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                აირჩიეთ რეჟიმი: მომავალი (Upcoming) ან დასრულებული მატჩი
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('upcoming');
                }}
                className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'upcoming'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">მომავალი</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('completed');
                }}
                className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'completed'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">დასრულებული</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Tournament & Game */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  ტურნირი / ღონისძიების სახელი
                </label>
                <input
                  type="text"
                  required
                  placeholder="მაგ: ოფიციალური სერია - მატჩი #5"
                  value={tournament}
                  onChange={(e) => setTournament(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  დისციპლინა / თამაში
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                >
                  {GAME_CATEGORIES.filter(g => g !== 'ყველა თამაში').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {game === 'სხვა' && (
                  <input
                    type="text"
                    placeholder="ჩაწერეთ თამაშის სახელი..."
                    value={customGame}
                    onChange={(e) => setCustomGame(e.target.value)}
                    className="mt-2 w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600"
                  />
                )}
              </div>
            </div>

            {/* Row 2: Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  თარიღი
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              {mode === 'upcoming' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                    დაწყების დრო (საათი:წუთი)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    მატჩის MVP
                  </label>
                  <input
                    type="text"
                    placeholder="მაგ: loozollo"
                    value={mvp}
                    onChange={(e) => setMvp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>
              )}
            </div>

            {/* Upcoming: Featured on Main Page Toggle */}
            {mode === 'upcoming' && (
              <div 
                onClick={() => {
                  sound.playClick();
                  setFeatured(!featured);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  featured 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    featured ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    <Star className={`w-4 h-4 ${featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      მთავარ გვერდზე გამოჩენა (Featured)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {featured 
                        ? "ეს მატჩი გამოჩნდება საიტის მთავარ გვერდზე" 
                        : "ეს მატჩი დამალული იქნება მთავარი გვერდიდან (ინახება მხოლოდ ადმინში)"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    featured ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    featured ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            )}

            {/* Completed Score Arena Input (Only in Completed Mode) */}
            {mode === 'completed' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="block text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  საბოლოო ანგარიში
                </span>

                <div className="flex items-center justify-around gap-4">
                  
                  {/* loozollo */}
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
                        className="w-16 text-center py-1.5 text-2xl font-black font-display bg-slate-900 border border-cyan-500/40 rounded-xl text-cyan-400 focus:outline-none"
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

                  <span className="text-2xl font-black text-slate-600">:</span>

                  {/* kamkama */}
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
                        className="w-16 text-center py-1.5 text-2xl font-black font-display bg-slate-900 border border-rose-500/40 rounded-xl text-rose-400 focus:outline-none"
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

                {/* Live Winner Indicator */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  {Number(loozolloScore) > Number(kamkamaScore) ? (
                    <div className="py-2 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-300">გამარჯვებული:</span>
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                        loozollo (+{Number(loozolloScore) - Number(kamkamaScore)})
                      </span>
                    </div>
                  ) : Number(kamkamaScore) > Number(loozolloScore) ? (
                    <div className="py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-300">გამარჯვებული:</span>
                      <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                        kamkama (+{Number(kamkamaScore) - Number(loozolloScore)})
                      </span>
                    </div>
                  ) : (
                    <div className="py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                      ⚖️ ანგარიში თანაბარია (ფრე)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes / Preview comments */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {mode === 'upcoming' ? "მომავალი მატჩის აღწერა / ანონსი" : "შენიშვნა / მატჩის კომენტარი"}
              </label>
              <input
                type="text"
                placeholder={mode === 'upcoming' ? "მაგ: გადამწყვეტი მე-5 დუელი! შეძლებს kamkama სხვაობის შემცირებას?" : "მაგ: დამატებით დროში გამარჯვება"}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
                >
                  გაუქმება
                </button>
              )}

              <button
                type="submit"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition ${
                  mode === 'upcoming'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{editingId ? "ცვლილების შენახვა" : mode === 'upcoming' ? "მომავალი მატჩის დაგეგმვა" : "დასრულებული მატჩის ჩაწერა"}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Section 1: Upcoming Matches List */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold font-display text-white">
                დაგეგმილი მატჩები (Upcoming Queue)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {upcomingList.length}
              </span>
            </div>
          </div>

          {upcomingList.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">
              ამ ეტაპზე დაგეგმილი მატჩი არ არის. შეგიძლიათ ზემოთ აირჩიოთ „მომავალი მატჩი“ და დაამატოთ.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingList.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        UPCOMING
                      </span>
                      <span className="text-xs font-bold text-white">{m.tournament}</span>
                      <span className="text-[11px] text-slate-400">• {m.game}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>თარიღი: <strong className="text-slate-200">{m.date} {m.time ? `(${m.time})` : ''}</strong></span>
                      {m.notes && <span className="text-slate-300 italic">„{m.notes}“</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* One-click Featured toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(m)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        m.featured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-sm'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                      title={m.featured ? "მთავარ გვერდზე ჩანს. დააჭირეთ მოსახსნელად." : "დამალულია. დააჭირეთ მთავარზე გამოსაჩენად."}
                    >
                      <Star className={`w-3.5 h-3.5 ${m.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{m.featured ? "მთავარზე ჩანს" : "დამალულია"}</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setFinishingMatch(m);
                        setFinishLoozolloScore(0);
                        setFinishKamkamaScore(0);
                        setFinishMvp('');
                        setFinishNotes(m.notes || '');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>შედეგის შეყვანა</span>
                    </button>

                    <button
                      onClick={() => handleStartEdit(m)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      title="რედაქტირება"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        onDeleteMatch(m.id);
                      }}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs border border-rose-800/40 transition"
                      title="წაშლა"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Completed Matches List */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-display text-white">
                დასრულებული მატჩების მართვა
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {completedList.length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {completedList.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{m.tournament}</span>
                    <span className="text-[11px] text-slate-400">• {m.game}</span>
                    <span className="text-[11px] text-slate-500">({m.date})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className={m.winner === 'loozollo' ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}>
                      loozollo: {m.loozolloScore}
                    </span>
                    <span className="text-slate-600 font-bold">:</span>
                    <span className={m.winner === 'kamkama' ? 'text-rose-400 font-extrabold' : 'text-slate-400'}>
                      kamkama: {m.kamkamaScore}
                    </span>
                    {m.notes && <span className="text-slate-500 italic ml-2">„{m.notes}“</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleStartEdit(m)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    title="რედაქტირება"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onDeleteMatch(m.id);
                    }}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs border border-rose-800/40 transition"
                    title="წაშლა"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Backup & Maintenance */}
        <div className="rounded-3xl p-6 bg-slate-900/40 border border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              მონაცემთა ბაზის მართვა
            </h4>
            <p className="text-xs text-slate-400">
              შეგიძლიათ ჩამოტვირთოთ JSON სარეზერვო ფაილი ან დააბრუნოთ საწყისი მონაცემები
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>ექსპორტი (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('დავაბრუნოთ საწყისი მატჩები?')) {
                  onResetMatches();
                  sound.playVictory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>საწყისი მატჩები</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('ყველა მატჩის წაშლა და ნულიდან დაწყება?')) {
                  onClearMatches();
                  sound.playClick();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 border border-rose-800/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>სრული გასუფთავება</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal: Finish Upcoming Match */}
      {finishingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-black font-display text-white mb-1">
              მატჩის დასრულება & შედეგი
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {finishingMatch.tournament} ({finishingMatch.game})
            </p>

            <form onSubmit={handleConfirmFinish} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="block text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  საბოლოო ანგარიში
                </span>

                <div className="flex items-center justify-around gap-4">
                  {/* loozollo */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-cyan-400 uppercase mb-1">loozollo</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFinishLoozolloScore(Math.max(0, finishLoozolloScore - 1))}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={finishLoozolloScore}
                        onChange={(e) => setFinishLoozolloScore(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-center py-1.5 text-2xl font-black font-display bg-slate-900 border border-cyan-500/40 rounded-xl text-cyan-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFinishLoozolloScore(finishLoozolloScore + 1)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="text-2xl font-black text-slate-600">:</span>

                  {/* kamkama */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-rose-400 uppercase mb-1">kamkama</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFinishKamkamaScore(Math.max(0, finishKamkamaScore - 1))}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={finishKamkamaScore}
                        onChange={(e) => setFinishKamkamaScore(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-center py-1.5 text-2xl font-black font-display bg-slate-900 border border-rose-500/40 rounded-xl text-rose-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFinishKamkamaScore(finishKamkamaScore + 1)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Live Winner Indicator */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  {Number(finishLoozolloScore) > Number(finishKamkamaScore) ? (
                    <div className="py-2 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-300">გამარჯვებული:</span>
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                        loozollo (+{Number(finishLoozolloScore) - Number(finishKamkamaScore)})
                      </span>
                    </div>
                  ) : Number(finishKamkamaScore) > Number(finishLoozolloScore) ? (
                    <div className="py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-300">გამარჯვებული:</span>
                      <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                        kamkama (+{Number(finishKamkamaScore) - Number(finishLoozolloScore)})
                      </span>
                    </div>
                  ) : (
                    <div className="py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                      ⚖️ ანგარიში თანაბარია (ფრე)
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">მატჩის MVP</label>
                <input
                  type="text"
                  placeholder={
                    Number(finishKamkamaScore) > Number(finishLoozolloScore)
                      ? "მაგ: kamkama"
                      : "მაგ: loozollo"
                  }
                  value={finishMvp}
                  onChange={(e) => setFinishMvp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">შენიშვნა / კომენტარი</label>
                <input
                  type="text"
                  placeholder="მაგ: დამატებით დროში გამარჯვება"
                  value={finishNotes}
                  onChange={(e) => setFinishNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFinishingMatch(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                >
                  შედეგის შენახვა & დასრულება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
