'use client';

import React from 'react';

export default function Legend({ stats, selectedStatuses = [], onToggleStatus }) {
  const isSelected = (status) =>
    selectedStatuses.length === 0 || selectedStatuses.includes(status);

  return (
    <div className="bg-white border border-gray-200 rounded p-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-800">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <span>Status:</span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Available */}
        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus('available')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer ${
            isSelected('available')
              ? 'bg-gray-100 border-gray-400 text-gray-800'
              : 'bg-white border-gray-200 text-gray-400'
          }`}
          title="Toggle Available plots"
        >
          
          <span>Available</span>
          <span className="text-gray-500 font-mono">({stats.available})</span>
        </button>

        {/* Booked */}
        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus('booked')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer ${
            isSelected('booked')
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-white border-gray-200 text-gray-400'
          }`}
          title="Toggle Booked plots"
        >
         
          <span>Booked</span>
          <span className="text-gray-500 font-mono">({stats.booked})</span>
        </button>

        {/* Sold */}
        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus('sold')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer ${
            isSelected('sold')
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-white border-gray-200 text-gray-400'
          }`}
          title="Toggle Sold plots"
        >
          
          <span>Sold</span>
          <span className="text-gray-500 font-mono">({stats.sold})</span>
        </button>
      </div>

      <div className="text-xs text-gray-500">
        Total Plots: <span className="font-semibold text-gray-800 font-mono">{stats.total}</span>
      </div>
    </div>
  );
}



