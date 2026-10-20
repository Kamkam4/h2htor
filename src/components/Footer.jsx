import React from 'react';
import { Swords, ArrowUp, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Footer() {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    sound.playClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060910] text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar with balanced left and right sections */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white font-display">
                LOOZOLLO <span className="text-slate-600">VS</span> KAMKAMA
              </span>
              <p className="text-xs text-slate-500">
                ოფიციალური H2H ტურნირების სარეგისტრაციო პლატფორმა
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors + Scroll to top */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('upcoming-section')}
              className="text-xs font-semibold text-slate-400 hover:text-amber-300 transition"
            >
              მომავალი მატჩები
            </button>
            <span className="text-slate-800 hidden sm:inline">•</span>
            <button
              onClick={() => scrollToSection('matches-section')}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition"
            >
              ისტორია & შედეგები
            </button>
            <span className="text-slate-800 hidden sm:inline">•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700"
            >
              <span>ზემოთ ასვლა</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>მონაცემები დაცულია და ინახება ლოკალურად ბრაუზერში</span>
          </div>

          <div>
            © 2026 Head-to-Head Tournament Arena. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
