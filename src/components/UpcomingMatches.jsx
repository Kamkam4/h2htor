import React from 'react';
import { Clock, Calendar, Gamepad2, Flame, Swords, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

export default function UpcomingMatches({ upcomingMatches }) {
  // Only display upcoming matches that are marked as featured
  const featuredList = (upcomingMatches || []).filter(m => m.featured === true);

  if (featuredList.length === 0) {
    return null;
  }

  return (
    <section className="pt-4 sm:pt-6 pb-2" id="upcoming-section">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Header Pill */}
        <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-ping" />
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black text-amber-300">
              მომდევნო მატჩი • NEXT BATTLE
            </span>
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
            {featuredList.length === 1 ? '1 დაგეგმილი' : `${featuredList.length} დაგეგმილი`}
          </span>
        </div>

        {/* Featured Cards */}
        <div className="space-y-4">
          {featuredList.map((m) => (
            <div
              key={m.id}
              className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 bg-gradient-to-r from-[#0c1222] via-[#141226] to-[#1c0f18] border border-amber-500/40 shadow-xl shadow-amber-500/5 overflow-hidden group hover:border-amber-400/60 transition-all duration-300"
            >
              {/* Glow accents */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                
                {/* Left info: Tournament + Date + Game */}
                <div className="space-y-1.5 sm:space-y-2 lg:max-w-xs shrink-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3 fill-slate-950" />
                      UPCOMING
                    </span>
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" />
                      {m.game}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg lg:text-xl font-black font-display text-white tracking-wide">
                    {m.tournament}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{m.date}</span>
                    </div>
                    {m.time && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono text-[11px]">
                        ⏰ {m.time}
                      </span>
                    )}
                  </div>
                </div>

                {/* Center: Face-off Duel Arena (Fully responsive on mobile) */}
                <div className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2 sm:gap-4">
                  
                  {/* loozollo */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
                      <div className="w-full h-full bg-[#080d18] rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-sm sm:text-xl">
                        ⚡
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm sm:text-lg font-black text-cyan-400 block font-display truncate">
                        loozollo
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden xs:block truncate">
                        3 მოგება
                      </span>
                    </div>
                  </div>

                  {/* VS Badge with Glow */}
                  <div className="flex flex-col items-center px-1 sm:px-2 shrink-0">
                    <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-amber-500/30 text-[11px] sm:text-sm font-black font-display text-white tracking-widest shadow-inner">
                      VS
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-400 mt-0.5 sm:mt-1 animate-pulse hidden sm:inline">
                      დაგეგმილია
                    </span>
                  </div>

                  {/* kamkama */}
                  <div className="flex items-center justify-end gap-2 sm:gap-3 text-right min-w-0">
                    <div className="min-w-0">
                      <span className="text-sm sm:text-lg font-black text-rose-400 block font-display truncate">
                        kamkama
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden xs:block truncate">
                        1 მოგება
                      </span>
                    </div>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-600 p-0.5 shadow-md shadow-rose-500/20 shrink-0">
                      <div className="w-full h-full bg-[#080d18] rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-sm sm:text-xl">
                        🔥
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Note */}
              {m.notes && (
                <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-800/80 flex items-start sm:items-center gap-2 text-xs text-slate-300 italic">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="line-clamp-2 sm:line-clamp-1">„{m.notes}“</span>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
