import React from 'react';
import { Swords, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({
  matches,
  loozolloWins,
  kamkamaWins,
  draws,
  onOpenAdmin,
  isMuted,
  onToggleMute,
}) {
  const completedMatches = matches.filter(m => m.status !== 'upcoming');
  const loozolloTotal = completedMatches.reduce((a, m) => a + (Number(m.loozolloScore) || 0), 0);
  const kamkamaTotal = completedMatches.reduce((a, m) => a + (Number(m.kamkamaScore) || 0), 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070a12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Brand / Title (Secret double-click on logo can open admin) */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onDoubleClick={() => {
            if (onOpenAdmin) {
              sound.playClick();
              onOpenAdmin();
            }
          }}
          title="loozollo VS kamkama"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-rose-500 p-[1px] shadow-lg shadow-cyan-500/10">
            <div className="w-full h-full bg-[#0b0f19] rounded-[15px] flex items-center justify-center">
              <Swords className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-rose-400 bg-clip-text text-transparent font-display">
                H2H TOURNAMENT
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              <span className="text-cyan-400 font-semibold">loozollo</span>
              <span className="text-slate-600 mx-1.5 font-bold">VS</span>
              <span className="text-rose-400 font-semibold">kamkama</span>
            </p>
          </div>
        </div>

        {/* Live Score Ticker - Dead-Center on Desktop */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">სერია:</span>
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">loozollo</span>
            <span className="text-sm font-black font-display text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50">
              {loozolloWins}
            </span>
            <span className="text-xs text-slate-500 font-bold">:</span>
            <span className="text-sm font-black font-display text-rose-300 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/50">
              {kamkamaWins}
            </span>
            <span className="text-xs font-bold tracking-wider text-rose-400 uppercase">kamkama</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Total Points */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-400">ქულები:</span>
            <span className="font-bold text-cyan-400">{loozolloTotal}</span>
            <span className="text-slate-600 font-bold">:</span>
            <span className="font-bold text-rose-400">{kamkamaTotal}</span>
          </div>
        </div>

        {/* Right Side: Compact mobile score + Sound control */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Mobile/Tablet live score pill */}
          <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold shadow-inner">
            <span className="text-cyan-400">{loozolloWins}</span>
            <span className="text-slate-600">:</span>
            <span className="text-rose-400">{kamkamaWins}</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleMute();
              sound.playClick();
            }}
            title={isMuted ? "ხმის ჩართვა" : "ხმის გამორთვა"}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition shadow-sm"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
            <span className="text-xs font-semibold hidden sm:inline">
              {isMuted ? "ხმა: Off" : "ხმა: On"}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
