import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Calendar, 
  Gamepad2, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Award,
  ArrowUpDown,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export default function MatchList({ 
  matches, 
}) {
  const [filterWinner, setFilterWinner] = useState('all'); // all | loozollo | kamkama | draw
  const [selectedGame, setSelectedGame] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | highscore

  // Filter out any upcoming matches, only display completed in this history log
  const completedMatches = useMemo(() => {
    return matches.filter(m => m.status !== 'upcoming');
  }, [matches]);

  // Unique game categories from completed matches
  const uniqueGames = useMemo(() => {
    const set = new Set();
    completedMatches.forEach(m => {
      if (m.game) set.add(m.game);
    });
    return Array.from(set);
  }, [completedMatches]);

  // Filtering & Sorting
  const filteredMatches = useMemo(() => {
    return completedMatches
      .filter(m => {
        // Filter by winner
        if (filterWinner !== 'all' && m.winner !== filterWinner) {
          return false;
        }
        // Filter by game
        if (selectedGame !== 'all' && m.game !== selectedGame) {
          return false;
        }
        // Search term
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const inTournament = m.tournament?.toLowerCase().includes(q);
          const inNotes = m.notes?.toLowerCase().includes(q);
          const inGame = m.game?.toLowerCase().includes(q);
          const inMvp = m.mvp?.toLowerCase().includes(q);
          if (!inTournament && !inNotes && !inGame && !inMvp) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        }
        if (sortBy === 'oldest') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === 'highscore') {
          const totalA = (Number(a.loozolloScore) || 0) + (Number(a.kamkamaScore) || 0);
          const totalB = (Number(b.loozolloScore) || 0) + (Number(b.kamkamaScore) || 0);
          return totalB - totalA;
        }
        return 0;
      });
  }, [matches, filterWinner, selectedGame, searchTerm, sortBy]);

  const handleCardClick = (match) => {
    sound.playScore();
    if (match.winner === 'loozollo') {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { x: 0.3, y: 0.6 },
        colors: ['#06b6d4', '#3b82f6']
      });
    } else if (match.winner === 'kamkama') {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { x: 0.7, y: 0.6 },
        colors: ['#f43f5e', '#f97316']
      });
    }
  };

  return (
    <section className="py-6 sm:py-8" id="matches-section">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-display text-white tracking-tight uppercase">
                მატჩების ისტორია & H2H რეესტრი
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {filteredMatches.length} / {completedMatches.length}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
              ყველა ოფიციალური და ამხანაგური მატჩის შედეგი დეტალური ანგარიშითა და ჩანაწერებით
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
          
          {/* Winner Filter Tabs (Swipeable on mobile) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => { sound.playClick(); setFilterWinner('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                filterWinner === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ყველა ({completedMatches.length})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilterWinner('loozollo'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                filterWinner === 'loozollo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              loozollo ({completedMatches.filter(m => m.winner === 'loozollo').length})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilterWinner('kamkama'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                filterWinner === 'kamkama'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              kamkama ({completedMatches.filter(m => m.winner === 'kamkama').length})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilterWinner('draw'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                filterWinner === 'draw'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              ფრე ({completedMatches.filter(m => m.winner === 'draw').length})
            </button>
          </div>

          {/* Search & Selectors */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ძიება (ტურნირი, MVP)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Game Selector */}
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/60"
              >
                <option value="all">ყველა თამაში</option>
                {uniqueGames.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/60"
              >
                <option value="newest">უახლესი</option>
                <option value="oldest">უძველესი</option>
                <option value="highscore">უმაღლესი</option>
              </select>
            </div>

          </div>

        </div>

        {/* Matches Grid / List */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-slate-800/80 bg-slate-900/30">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-300">მატჩი ვერ მოიძებნა</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              არჩეული ფილტრის ან ძიების პარამეტრებით შედეგი არ არის. სცადეთ ფილტრის გასუფთავება.
            </p>
            <button
              onClick={() => {
                setFilterWinner('all');
                setSelectedGame('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-cyan-400 hover:bg-slate-700 transition"
            >
              ფილტრების გასუფთავება
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((match) => {
              const isLoozolloWin = match.winner === 'loozollo';
              const isKamkamaWin = match.winner === 'kamkama';
              const isDraw = match.winner === 'draw';

              return (
                <div
                  key={match.id}
                  onClick={() => handleCardClick(match)}
                  className={`group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isLoozolloWin 
                      ? 'bg-gradient-to-br from-slate-900/90 via-[#0b1322] to-slate-950/90 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10'
                      : isKamkamaWin
                      ? 'bg-gradient-to-br from-slate-900/90 via-[#180e14] to-slate-950/90 border-rose-500/30 hover:border-rose-400/60 hover:shadow-lg hover:shadow-rose-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10'
                  }`}
                >
                  {/* Top line: Tournament & Date & Game Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700/60 flex items-center gap-1.5 shrink-0">
                        <Gamepad2 className="w-3 h-3 text-cyan-400" />
                        {match.game}
                      </span>
                      <span className="text-xs font-bold text-slate-300 truncate" title={match.tournament}>
                        {match.tournament}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {match.date}
                      </span>
                    </div>
                  </div>

                  {/* Scoreboard Arena */}
                  <div className="py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between mb-3">
                    
                    {/* loozollo */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isLoozolloWin 
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isLoozolloWin ? <Trophy className="w-3.5 h-3.5 fill-slate-950" /> : "L"}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-sm font-extrabold truncate block ${
                          isLoozolloWin ? 'text-cyan-400' : 'text-slate-300'
                        }`}>
                          loozollo
                        </span>
                        {isLoozolloWin && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-400/90 block truncate">
                            WINNER
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numeric Score */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 shrink-0">
                      <span className={`text-xl sm:text-3xl font-black font-display ${
                        isLoozolloWin ? 'text-cyan-400' : 'text-slate-400'
                      }`}>
                        {match.loozolloScore}
                      </span>
                      <span className="text-slate-600 font-bold text-sm sm:text-base">:</span>
                      <span className={`text-xl sm:text-3xl font-black font-display ${
                        isKamkamaWin ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {match.kamkamaScore}
                      </span>
                    </div>

                    {/* kamkama */}
                    <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0 text-right">
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-sm font-extrabold truncate block ${
                          isKamkamaWin ? 'text-rose-400' : 'text-slate-300'
                        }`}>
                          kamkama
                        </span>
                        {isKamkamaWin && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-400/90 block truncate">
                            WINNER
                          </span>
                        )}
                      </div>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isKamkamaWin 
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isKamkamaWin ? <Trophy className="w-3.5 h-3.5 fill-white" /> : "K"}
                      </div>
                    </div>

                  </div>

                  {/* Notes / Highlights & MVP */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                    {match.notes ? (
                      <p className="italic text-slate-300 line-clamp-1">
                        „{match.notes}“
                      </p>
                    ) : (
                      <span className="text-slate-600">ჩანაწერი არ არის</span>
                    )}

                    {match.mvp && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 shrink-0">
                        <Award className="w-3 h-3" /> MVP: {match.mvp}
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
