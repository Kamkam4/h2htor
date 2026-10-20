import React from 'react';
import { BarChart3, TrendingUp, Target, Award, Flame, Scale, Gamepad2 } from 'lucide-react';

export default function StatsOverview({ matches, loozolloWins, kamkamaWins, draws }) {
  const completed = matches.filter(m => m.status !== 'upcoming');
  const totalMatches = completed.length;
  
  // Total Scores
  const loozolloScoreTotal = completed.reduce((acc, m) => acc + (Number(m.loozolloScore) || 0), 0);
  const kamkamaScoreTotal = completed.reduce((acc, m) => acc + (Number(m.kamkamaScore) || 0), 0);
  const totalPoints = loozolloScoreTotal + kamkamaScoreTotal;

  // Averages
  const avgGoalsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(1) : 0;
  const avgLoozollo = totalMatches > 0 ? (loozolloScoreTotal / totalMatches).toFixed(1) : 0;
  const avgKamkama = totalMatches > 0 ? (kamkamaScoreTotal / totalMatches).toFixed(1) : 0;

  // Largest margin
  let largestMarginMatch = null;
  let maxMargin = -1;
  completed.forEach(m => {
    const diff = Math.abs((Number(m.loozolloScore) || 0) - (Number(m.kamkamaScore) || 0));
    if (diff > maxMargin) {
      maxMargin = diff;
      largestMarginMatch = m;
    }
  });

  // Calculate streaks
  let maxLoozolloStreak = 0;
  let curLoozolloStreak = 0;
  let maxKamkamaStreak = 0;
  let curKamkamaStreak = 0;

  // Loop chronological
  const chronological = [...completed].reverse();
  chronological.forEach(m => {
    if (m.winner === 'loozollo') {
      curLoozolloStreak++;
      curKamkamaStreak = 0;
      if (curLoozolloStreak > maxLoozolloStreak) maxLoozolloStreak = curLoozolloStreak;
    } else if (m.winner === 'kamkama') {
      curKamkamaStreak++;
      curLoozolloStreak = 0;
      if (curKamkamaStreak > maxKamkamaStreak) maxKamkamaStreak = curKamkamaStreak;
    } else {
      curLoozolloStreak = 0;
      curKamkamaStreak = 0;
    }
  });

  // Game breakdown
  const gameStats = {};
  completed.forEach(m => {
    const g = m.game || "სხვა";
    if (!gameStats[g]) {
      gameStats[g] = { total: 0, loozollo: 0, kamkama: 0, draws: 0 };
    }
    gameStats[g].total++;
    if (m.winner === 'loozollo') gameStats[g].loozollo++;
    else if (m.winner === 'kamkama') gameStats[g].kamkama++;
    else gameStats[g].draws++;
  });

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white tracking-wide uppercase">
                H2H დეტალური ანალიტიკა
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                სტატისტიკური მონაცემები, სერიები და დისციპლინები
              </p>
            </div>
          </div>
        </div>

        {/* 4 Primary Metric Cards (2x2 on Mobile, 4 columns on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
          
          {/* Card 1: Total Points / Goals */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">საერთო ქულა</span>
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black font-display text-white">{totalPoints}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">(საშ. {avgGoalsPerMatch})</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] sm:text-xs pt-2.5 border-t border-slate-800">
              <span className="text-cyan-400 font-semibold truncate">L: {loozolloScoreTotal}</span>
              <span className="text-rose-400 font-semibold truncate">K: {kamkamaScoreTotal}</span>
            </div>
          </div>

          {/* Card 2: Highest Scoring Game / Margin */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">სხვაობა</span>
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black font-display text-amber-400">
                +{maxMargin >= 0 ? maxMargin : 0}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 truncate">
                {largestMarginMatch ? `${largestMarginMatch.loozolloScore}:${largestMarginMatch.kamkamaScore}` : "-"}
              </span>
            </div>
            <div className="mt-2.5 text-[10px] sm:text-xs text-slate-400 truncate pt-2.5 border-t border-slate-800">
              {largestMarginMatch ? largestMarginMatch.tournament : "მონაცემი არ არის"}
            </div>
          </div>

          {/* Card 3: Best Streak */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">სერია</span>
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black font-display text-orange-400">
                {Math.max(maxLoozolloStreak, maxKamkamaStreak)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">მატჩი</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] sm:text-xs pt-2.5 border-t border-slate-800">
              <span className="text-cyan-400 font-semibold truncate">L: {maxLoozolloStreak}</span>
              <span className="text-rose-400 font-semibold truncate">K: {maxKamkamaStreak}</span>
            </div>
          </div>

          {/* Card 4: Average Score per Match */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">საშუალო</span>
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-3xl font-black font-display text-emerald-400">
                {avgLoozollo} - {avgKamkama}
              </span>
            </div>
            <div className="mt-2.5 text-[10px] sm:text-xs text-slate-400 pt-2.5 border-t border-slate-800 flex justify-between">
              <span>ჯამში</span>
              <span className="text-slate-300 font-medium">{totalMatches} მატჩი</span>
            </div>
          </div>

        </div>

        {/* Game Disciplines Breakdown */}
        {Object.keys(gameStats).length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                შედეგები თამაშების (დისციპლინების) მიხედვით
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(gameStats).map(([gameName, stat]) => {
                const total = stat.total;
                const lPct = Math.round((stat.loozollo / total) * 100);
                const kPct = Math.round((stat.kamkama / total) * 100);

                return (
                  <div key={gameName} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 truncate pr-2">{gameName}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">{total} მატჩი</span>
                    </div>

                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-cyan-400">{stat.loozollo} win</span>
                      {stat.draws > 0 && <span className="text-amber-400/80 text-[10px]">{stat.draws} draw</span>}
                      <span className="text-rose-400">{stat.kamkama} win</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: `${lPct}%` }} className="h-full bg-cyan-400" />
                      {stat.draws > 0 && (
                        <div style={{ width: `${(stat.draws / total) * 100}%` }} className="h-full bg-amber-400" />
                      )}
                      <div style={{ width: `${kPct}%` }} className="h-full bg-rose-500 ml-auto" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
