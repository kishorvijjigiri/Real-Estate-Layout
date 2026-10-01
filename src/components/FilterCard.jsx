'use client';

import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { SQFT_FILTER_PRESETS, MAX_COST_DEFAULT } from '@/data/plotsData';
import { formatCurrency } from '@/utils/formatters';

export default function FilterCard({
  selectedStatuses = [],
  onToggleStatus,
  selectedSize,
  onSelectSize,
  maxCost,
  onCostChange,
  onReset,
  onClose,
  matchingCount,
  totalCount,
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="bg-black/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/10 text-white w-72 max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-140px)] sm:max-h-[85vh] overflow-y-auto"
    >
      {/* Header: Title, Red Reset Button & X Close Button */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 sticky -top-4 bg-black/90 pt-1 -mx-1 px-1 backdrop-blur-md z-10">
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
          Apply Filter
        </h2>

        <div className="flex items-center gap-1.5">
          {/* Red reload/reset button  */}
          <button
            onClick={onReset}
            className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 transition-transform cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* X Close Button  */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-rose-600 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer border border-white/15"
              title="Close Filters"
              aria-label="Close Filter Card"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Square Ft Filter Chips (2-column grid matching reference image) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
            Square Ft:
          </label>
          {selectedSize && (
            <button
              onClick={() => onSelectSize(null)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SQFT_FILTER_PRESETS.map((preset) => {
            const isActive = selectedSize === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onSelectSize(isActive ? null : preset.value)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium border transition-all text-center ${isActive
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400 shadow-md'
                    : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                  }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Total Cost Slider  */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Total Cost:
          </span>
          <span className="font-bold text-cyan-300 font-mono">
            ₹0 - {formatCurrency(maxCost)}
          </span>
        </div>

        <div className="pt-1 pb-2">
          <input
            type="range"
            min={2000000}
            max={MAX_COST_DEFAULT}
            step={250000}
            value={maxCost}
            onChange={(e) => onCostChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>₹20 L</span>
            <span>₹1.0 Cr</span>
            <span>₹1.82 Cr</span>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-4 pt-3 border-t border-white/10">
        <label className="text-[11px] font-semibold text-slate-300 mb-2 block tracking-wider uppercase">
          Status Filter:
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => onToggleStatus('available')}
            className={`px-2 py-1.5 rounded-lg font-medium border text-center transition-all ${selectedStatuses.includes('available') || selectedStatuses.length === 0
                ? 'bg-slate-700 border-slate-400 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus('booked')}
            className={`px-2 py-1.5 rounded-lg font-medium border text-center transition-all ${selectedStatuses.includes('booked') || selectedStatuses.length === 0
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
          >
            Booked
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus('sold')}
            className={`px-2 py-1.5 rounded-lg font-medium border text-center transition-all ${selectedStatuses.includes('sold') || selectedStatuses.length === 0
                ? 'bg-rose-600 border-rose-400 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
          >
            Sold
          </button>
        </div>
      </div>

      {/* Filter metrics */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>Matching Plots:</span>
        <span className="font-bold text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          {matchingCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
