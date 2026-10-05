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
      className="bg-white border border-gray-300 rounded p-4 text-gray-900 w-72 max-w-[calc(100vw-1.5rem)] text-sm shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
        <span className="font-semibold text-gray-900">
          Filters
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onReset}
            className="p-1 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 cursor-pointer"
              title="Close Filters"
              aria-label="Close Filter Card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Square Ft Filter Chips */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-gray-600">
            Square Feet:
          </label>
          {selectedSize && (
            <button
              type="button"
              onClick={() => onSelectSize(null)}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {SQFT_FILTER_PRESETS.map((preset) => {
            const isActive = selectedSize === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onSelectSize(isActive ? null : preset.value)}
                className={`px-2 py-1 rounded border text-xs font-mono text-center cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Total Cost Slider */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-gray-600">Max Cost:</span>
          <span className="font-semibold text-gray-900 font-mono">
            {formatCurrency(maxCost)}
          </span>
        </div>

        <input
          type="range"
          min={2000000}
          max={MAX_COST_DEFAULT}
          step={250000}
          value={maxCost}
          onChange={(e) => onCostChange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
          <span>₹20 L</span>
          <span>₹1.0 Cr</span>
          <span>₹1.82 Cr</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-3 pt-2 border-t border-gray-200">
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          Status:
        </label>
        <div className="grid grid-cols-3 gap-1 text-xs">
          <button
            type="button"
            onClick={() => onToggleStatus('available')}
            className={`py-1 rounded border text-center cursor-pointer ${
              selectedStatuses.includes('available') || selectedStatuses.length === 0
                ? 'bg-gray-200 border-gray-400 text-gray-900 font-medium'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus('booked')}
            className={`py-1 rounded border text-center cursor-pointer ${
              selectedStatuses.includes('booked') || selectedStatuses.length === 0
                ? 'bg-green-100 border-green-500 text-green-900 font-medium'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            Booked
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus('sold')}
            className={`py-1 rounded border text-center cursor-pointer ${
              selectedStatuses.includes('sold') || selectedStatuses.length === 0
                ? 'bg-red-100 border-red-500 text-red-900 font-medium'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            Sold
          </button>
        </div>
      </div>

      {/* Filter metrics */}
      <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span>Matching:</span>
        <span className="font-semibold text-gray-800 font-mono">
          {matchingCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}



