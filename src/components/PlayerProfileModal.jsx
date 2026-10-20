import React from 'react';
import { X, Trophy, Shield, Zap, Target, Star, Quote, Award } from 'lucide-react';
import { PLAYER_PROFILES } from '../data/initialMatches';
import { sound } from '../utils/sound';

export default function PlayerProfileModal({
  isOpen,
  onClose,
  playerName,
  matches,
}) {
  if (!isOpen || !playerName) return null;

  const profile = PLAYER_PROFILES[playerName] || PLAYER_PROFILES.loozollo;
  const isLoozollo = playerName === 'loozollo';
  const opponentName = isLoozollo ? 'kamkama' : 'loozollo';

  // Stats calculation
  const totalMatches = matches.length;
  const wins = matches.filter(m => m.winner === playerName).length;
  const losses = matches.filter(m => m.winner === opponentName).length;
  const draws = matches.filter(m => m.winner === 'draw').length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  const scoreProp = isLoozollo ? 'loozolloScore' : 'kamkamaScore';
  const oppScoreProp = isLoozollo ? 'kamkamaScore' : 'loozolloScore';

  const totalPoints = matches.reduce((acc, m) => acc + (Number(m[scoreProp]) || 0), 0);
  const cleanSheets = matches.filter(m => Number(m[oppScoreProp]) === 0).length;
  const avgPoints = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner with Player Color */}
        <div className={`p-4 sm:p-6 bg-gradient-to-br ${profile.bgGradient} border-b border-slate-800 relative shrink-0`}>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="absolute top-3.5 right-3.5 p-1.5 sm:p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${profile.avatarBg} p-1 shadow-xl shrink-0`}>
              <div className="w-full h-full bg-[#090d16] rounded-[13px] flex items-center justify-center text-2xl sm:text-3xl">
                {isLoozollo ? '⚡' : '🔥'}
              </div>
            </div>

            <div className="min-w-0 pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isLoozollo ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {profile.badge}
                </span>
                <span className="text-xs text-slate-400 font-semibold truncate">{profile.title}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight truncate">
                {profile.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {/* Quote */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs italic text-slate-300">
              {profile.quote}
            </p>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">მოგება</span>
              <span className={`text-xl font-black font-display ${isLoozollo ? 'text-cyan-400' : 'text-rose-400'}`}>
                {wins}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Win Rate</span>
              <span className="text-xl font-black font-display text-white">
                {winRate}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">ქულები</span>
              <span className="text-xl font-black font-display text-slate-200">
                {totalPoints}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Clean Sheet</span>
              <span className="text-xl font-black font-display text-emerald-400">
                {cleanSheets}
              </span>
            </div>
          </div>

          {/* Player Attributes */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> სათამაშო სტილი:
              </span>
              <span className="text-slate-200 font-bold">{profile.playstyle}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" /> საყვარელი თამაში:
              </span>
              <span className="text-slate-200 font-bold">{profile.favoriteGame}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> საფირმო ნაბიჯი:
              </span>
              <span className="text-slate-200 font-bold">{profile.signatureMove}</span>
            </div>
          </div>

          {/* Close button */}
          <div className="pt-2">
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
            >
              დახურვა
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
