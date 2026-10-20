import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, Trash2, Check, Copy } from 'lucide-react';
import { sound } from '../utils/sound';

export default function ExportImportModal({
  isOpen,
  onClose,
  matches,
  onImportMatches,
  onResetMatches,
  onClearMatches,
}) {
  const [importJson, setImportJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(matches, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.playClick();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-h2h-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      setErrorMsg('');
      const parsed = JSON.parse(importJson);
      if (!Array.isArray(parsed)) {
        throw new Error('მონაცემები უნდა იყოს მატჩების მასივი (array)');
      }
      onImportMatches(parsed);
      sound.playVictory();
      onClose();
    } catch (err) {
      setErrorMsg('არასწორი JSON ფორმატი: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-base font-extrabold font-display text-white">
              მონაცემების მართვა & ექსპორტი
            </h3>
            <p className="text-[11px] text-slate-400">H2H ისტორიის შენახვა, აღდგენა და გადატანა</p>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Export section */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              მონაცემების ექსპორტი (შენახვა)
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>ფაილად ჩამოტვირთვა (.json)</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copied ? 'დაკოპირდა!' : 'კოპირება'}</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              მონაცემების იმპორტი (აღდგენა)
            </span>
            <textarea
              rows="3"
              placeholder="ჩასვით დაკოპირებული JSON მონაცემები აქ..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
            />
            {errorMsg && <p className="text-xs text-rose-400 mt-1">{errorMsg}</p>}
            <button
              disabled={!importJson.trim()}
              onClick={handleImportSubmit}
              className="mt-2 w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-xs font-bold text-white transition flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>იმპორტის განხორციელება</span>
            </button>
          </div>

          {/* Danger / Reset zone */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              სისტემური მოქმედებები
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (window.confirm('დავაბრუნოთ დემო მატჩების სია?')) {
                    onResetMatches();
                    sound.playClick();
                    onClose();
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>საწყისი მატჩები</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('ნამდვილად გსურთ ყველა მატჩის წაშლა და ნულიდან დაწყება?')) {
                    onClearMatches();
                    sound.playClick();
                    onClose();
                  }
                }}
                className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-xs font-semibold text-rose-300 border border-rose-800/40 flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>გასუფთავება</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
