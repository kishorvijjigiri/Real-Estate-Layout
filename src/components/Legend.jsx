'use client';

import React from 'react';

export default function Legend({ stats, selectedStatuses = [], onToggleStatus }) {
  const isSelected = (status) =>
    selectedStatuses.length === 0 || selectedStatuses.includes(status);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2 font-medium text-slate-300">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          Plot Status Legend:
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {/* Available (Gray) */}
        <button
          onClick={() => onToggleStatus && onToggleStatus('available')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            isSelected('available')
              ? 'bg-slate-700/80 border-slate-500 text-slate-100 shadow-sm'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
          }`}
          title="Click to toggle Available plots"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-200" />
          <span className="font-medium">Available (Gray)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
            {stats.available}
          </span>
        </button>

        {/* Booked (Green) */}
        <button
          onClick={() => onToggleStatus && onToggleStatus('booked')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            isSelected('booked')
              ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
          }`}
          title="Click to toggle Booked plots"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300" />
          <span className="font-medium">Booked (Green)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 font-mono">
            {stats.booked}
          </span>
        </button>

        {/* Sold (Disabled / Coral) */}
        <button
          onClick={() => onToggleStatus && onToggleStatus('sold')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            isSelected('sold')
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-sm'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
          }`}
          title="Click to toggle Sold plots"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-300" />
          <span className="font-medium">Sold ( Coral)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-900/60 text-rose-300 font-mono">
            {stats.sold}
          </span>
        </button>
      </div>

      <div className="text-slate-400 text-xs">
        Total Plots: <strong className="text-white font-mono">{stats.total}</strong>
      </div>
    </div>
  );
}
