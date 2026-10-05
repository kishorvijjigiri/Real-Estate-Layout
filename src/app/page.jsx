'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Legend from '@/components/Legend';
import FilterCard from '@/components/FilterCard';
import MasterPlanLayout from '@/components/MasterPlanLayout';
import { initialPlots, SQFT_FILTER_PRESETS, MAX_COST_DEFAULT } from '@/data/plotsData';
import { SlidersHorizontal } from 'lucide-react';

export default function Home() {
  // Filter States
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [maxCost, setMaxCost] = useState(MAX_COST_DEFAULT);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter Logic
  const filteredPlots = useMemo(() => {
    return initialPlots.filter((plot) => {
      // 1. Status Filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(plot.status)) {
        return false;
      }

      // 2. Square Ft Filter
      if (selectedSize) {
        const preset = SQFT_FILTER_PRESETS.find((p) => p.value === selectedSize);
        if (preset && plot.size > preset.max) {
          return false;
        }
      }

      // 3. Total Cost Filter
      if (plot.totalCost > maxCost) {
        return false;
      }

      return true;
    });
  }, [selectedStatuses, selectedSize, maxCost]);

  // Set of filtered plot IDs for fast lookup
  const filteredPlotIds = useMemo(() => {
    return new Set(filteredPlots.map((p) => p.id));
  }, [filteredPlots]);

  // Status statistics for legend
  const stats = useMemo(() => {
    return {
      total: initialPlots.length,
      available: initialPlots.filter((p) => p.status === 'available').length,
      booked: initialPlots.filter((p) => p.status === 'booked').length,
      sold: initialPlots.filter((p) => p.status === 'sold').length,
    };
  }, []);

  // Toggle status filter
  const handleToggleStatus = (status) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedStatuses([]);
    setSelectedSize(null);
    setMaxCost(MAX_COST_DEFAULT);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 py-4 space-y-3 flex-1">
        {/* Status Legend Bar */}
        <Legend
          stats={stats}
          selectedStatuses={selectedStatuses}
          onToggleStatus={handleToggleStatus}
        />

        {/* Master Plan Layout Container */}
        <div className="relative w-full">
          <MasterPlanLayout
            allPlots={initialPlots}
            filteredPlotIds={filteredPlotIds}
          />

          {/* Filter Card / Trigger Button */}
          {isFilterOpen ? (
            <div className="absolute top-3 left-3 z-30 max-w-[calc(100vw-1.5rem)]">
              <FilterCard
                selectedStatuses={selectedStatuses}
                onToggleStatus={handleToggleStatus}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                maxCost={maxCost}
                onCostChange={setMaxCost}
                onReset={handleResetFilters}
                onClose={() => setIsFilterOpen(false)}
                matchingCount={filteredPlots.length}
                totalCount={initialPlots.length}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-gray-100 border border-gray-300 text-xs font-medium text-gray-700 cursor-pointer shadow-sm"
              title="Open Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
              <span>Filter</span>
              {(selectedStatuses.length > 0 || selectedSize || maxCost < MAX_COST_DEFAULT) && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

