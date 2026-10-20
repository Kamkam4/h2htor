import React from 'react';
import { Trophy, Flame, Zap, Award, Sparkles, ChevronRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { PLAYER_PROFILES } from '../data/initialMatches';

export default function HeroBattle({
  loozolloWins,
  kamkamaWins,
  draws,
  totalMatches,
  loozolloTotalScore,
  kamkamaTotalScore,
  lastMatches,
  onOpenProfile,
}) {
  const loozolloWinPct = totalMatches > 0 ? Math.round((loozolloWins / totalMatches) * 100) : 0;
  const kamkamaWinPct = totalMatches > 0 ? Math.round((kamkamaWins / totalMatches) * 100) : 0;

  // Last 5 form calculations (only completed matches)
  const recentFive = [...lastMatches].filter(m => m.status !== 'upcoming').slice(0, 5);

  const getFormDot = (winner, targetPlayer) => {
    if (winner === 'draw') return { text: 'D', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (winner === targetPlayer) return { text: 'W', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    return { text: 'L', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  const triggerCelebration = () => {
    sound.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#06b6d4', '#f43f5e', '#fbbf24', '#ffffff']
    });
  };

  // Status message
  let leadText = "თანაბარი ანგარიში!";
  let leadColor = "text-amber-400 border-amber-500/20 bg-amber-500/10";
  if (loozolloWins > kamkamaWins) {
    const diff = loozolloWins - kamkamaWins;
    leadText = `loozollo ლიდერობს +${diff} მოგებით`;
    leadColor = "text-cyan-400 border-cyan-500/20 bg-cyan-500/10";
  } else if (kamkamaWins > loozolloWins) {
    const diff = kamkamaWins - loozolloWins;
    leadText = `kamkama ლიდერობს +${diff} მოგებით`;
    leadColor = "text-rose-400 border-rose-500/20 bg-rose-500/10";
  }

  return (
    <section className="relative overflow-hidden pt-8 pb-12">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Tagline */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-md mb-2.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-300">
              ოფიციალური H2H დაპირისპირება
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
            ტურნირის დუელი
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto px-2">
            loozollo-სა და kamkama-ს შორის ჩატარებული ყველა თამაშის სტატისტიკა, ისტორია და შედეგები
          </p>
        </div>

        {/* Main Battle Arena Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-[#0b0f19] to-slate-950/90 shadow-2xl p-4 sm:p-7 lg:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Player 1: loozollo */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                
                {/* Avatar */}
                <div className="relative group cursor-pointer" onClick={() => onOpenProfile('loozollo')}>
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-70 blur-md group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 p-1 flex items-center justify-center shadow-xl">
                    <div className="w-full h-full bg-[#090d16] rounded-[14px] flex flex-col items-center justify-center p-2">
                      <span className="text-3xl sm:text-4xl">⚡</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mt-1">LZZ</span>
                    </div>
                  </div>
                  {loozolloWins > kamkamaWins && (
                    <div className="absolute -top-3 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
                      <Trophy className="w-4 h-4 fill-slate-950" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {PLAYER_PROFILES.loozollo.badge}
                    </span>
                    <button 
                      onClick={() => onOpenProfile('loozollo')}
                      className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
                    >
                      <User className="w-3.5 h-3.5" /> პროფილი
                    </button>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white hover:text-cyan-400 transition cursor-pointer" onClick={() => onOpenProfile('loozollo')}>
                    loozollo
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {PLAYER_PROFILES.loozollo.title} • {PLAYER_PROFILES.loozollo.playstyle}
                  </p>
                </div>
              </div>

              {/* Stats strip for loozollo */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6 pt-5 border-t border-slate-800/80">
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">მოგება</span>
                  <span className="text-2xl font-black font-display text-cyan-400">{loozolloWins}</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Win Rate</span>
                  <span className="text-2xl font-black font-display text-white">{loozolloWinPct}%</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">ქულები</span>
                  <span className="text-2xl font-black font-display text-slate-200">{loozolloTotalScore}</span>
                </div>
              </div>

              {/* Form Guide */}
              <div className="mt-4 flex items-center justify-center lg:justify-start gap-2 w-full">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mr-1">ფორმა:</span>
                <div className="flex gap-1.5">
                  {recentFive.map((m) => {
                    const form = getFormDot(m.winner, 'loozollo');
                    return (
                      <span
                        key={m.id}
                        title={`მატჩი: ${m.tournament} (${m.loozolloScore}-${m.kamkamaScore})`}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-black ${form.bg}`}
                      >
                        {form.text}
                      </span>
                    );
                  })}
                  {recentFive.length === 0 && <span className="text-xs text-slate-500">მონაცემები არ არის</span>}
                </div>
              </div>

            </div>

            {/* VS Center Pillar */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-4 lg:py-0">
              
              {/* Grand Trophy / Celebration Button */}
              <button
                onClick={triggerCelebration}
                title="დააჭირე ფეიერვერკისთვის!"
                className="group relative p-4 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 mb-3"
              >
                <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-500/40 transition" />
                <Trophy className="relative w-7 h-7 text-amber-400 drop-shadow" />
              </button>

              <div className="relative">
                <span className="text-3xl sm:text-4xl font-black font-display italic tracking-widest bg-gradient-to-b from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
                  VS
                </span>
              </div>

              <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                სულ {totalMatches} მატჩი
              </div>

              {/* Lead status badge */}
              <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${leadColor}`}>
                {leadText}
              </div>

            </div>

            {/* Player 2: kamkama */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end text-center lg:text-right">
              <div className="flex flex-col sm:flex-row-reverse items-center gap-5 w-full">
                
                {/* Avatar */}
                <div className="relative group cursor-pointer" onClick={() => onOpenProfile('kamkama')}>
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 opacity-70 blur-md group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-600 to-amber-900 p-1 flex items-center justify-center shadow-xl">
                    <div className="w-full h-full bg-[#090d16] rounded-[14px] flex flex-col items-center justify-center p-2">
                      <span className="text-3xl sm:text-4xl">🔥</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 mt-1">KMK</span>
                    </div>
                  </div>
                  {kamkamaWins > loozolloWins && (
                    <div className="absolute -top-3 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
                      <Trophy className="w-4 h-4 fill-slate-950" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-center lg:justify-end gap-2 mb-1">
                    <button 
                      onClick={() => onOpenProfile('kamkama')}
                      className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1 transition"
                    >
                      პროფილი <User className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {PLAYER_PROFILES.kamkama.badge}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white hover:text-rose-400 transition cursor-pointer" onClick={() => onOpenProfile('kamkama')}>
                    kamkama
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {PLAYER_PROFILES.kamkama.title} • {PLAYER_PROFILES.kamkama.playstyle}
                  </p>
                </div>
              </div>

              {/* Stats strip for kamkama */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6 pt-5 border-t border-slate-800/80">
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">მოგება</span>
                  <span className="text-2xl font-black font-display text-rose-400">{kamkamaWins}</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Win Rate</span>
                  <span className="text-2xl font-black font-display text-white">{kamkamaWinPct}%</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">ქულები</span>
                  <span className="text-2xl font-black font-display text-slate-200">{kamkamaTotalScore}</span>
                </div>
              </div>

              {/* Form Guide */}
              <div className="mt-4 flex items-center justify-center lg:justify-end gap-2 w-full">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mr-1">ფორმა:</span>
                <div className="flex gap-1.5">
                  {recentFive.map((m) => {
                    const form = getFormDot(m.winner, 'kamkama');
                    return (
                      <span
                        key={m.id}
                        title={`მატჩი: ${m.tournament} (${m.loozolloScore}-${m.kamkamaScore})`}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-black ${form.bg}`}
                      >
                        {form.text}
                      </span>
                    );
                  })}
                  {recentFive.length === 0 && <span className="text-xs text-slate-500">მონაცემები არ არის</span>}
                </div>
              </div>

            </div>

          </div>

          {/* Tug-of-War Momentum Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex justify-between text-xs font-bold tracking-wider uppercase mb-2">
              <span className="text-cyan-400">loozollo ({loozolloWinPct}%)</span>
              <span className="text-slate-400">დომინაციის ბალანსი</span>
              <span className="text-rose-400">kamkama ({kamkamaWinPct}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
              <div
                style={{ width: `${Math.max(5, loozolloWinPct)}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-500 relative"
              />
              {draws > 0 && (
                <div
                  style={{ width: `${(draws / totalMatches) * 100}%` }}
                  className="h-full bg-amber-500/60 transition-all duration-500"
                  title={`${draws} ფრე`}
                />
              )}
              <div
                style={{ width: `${Math.max(5, kamkamaWinPct)}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-r-full transition-all duration-500 ml-auto"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
