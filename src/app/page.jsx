'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Legend from '@/components/Legend';
import FilterCard from '@/components/FilterCard';
import MasterPlanLayout from '@/components/MasterPlanLayout';
import PlotModal from '@/components/PlotModal';
import { initialPlots, SQFT_FILTER_PRESETS, MAX_COST_DEFAULT } from '@/data/plotsData';
import { SlidersHorizontal } from 'lucide-react';

export default function Home() {
  // Filter States
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [maxCost, setMaxCost] = useState(MAX_COST_DEFAULT);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

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

  // Reset all filters (matches red reload button)
  const handleResetFilters = () => {
    setSelectedStatuses([]);
    setSelectedSize(null);
    setMaxCost(MAX_COST_DEFAULT);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* 1. Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4 flex-1">

        {/* Status Legend Bar */}
        <Legend
          stats={stats}
          selectedStatuses={selectedStatuses}
          onToggleStatus={handleToggleStatus}
        />

        {/* Master Plan Layout Container */}
        <div className="relative w-full">
          {/* Master Plan Aerial Image with Plot Grid Overlay */}
          <MasterPlanLayout
            allPlots={initialPlots}
            filteredPlotIds={filteredPlotIds}
            selectedPlot={selectedPlot}
            onSelectPlot={(plot) => setSelectedPlot(plot)}
          />

          {/* Floating Filter Card or Trigger Button on Top-Left (Mobile & Desktop Responsive) */}
          {isFilterOpen ? (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 max-w-[calc(100vw-1.5rem)]">
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
              onClick={() => setIsFilterOpen(true)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 active:scale-95 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 shadow-xl transition-all cursor-pointer"
              title="Open Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              <span>Apply Filter</span>
              {(selectedStatuses.length > 0 || selectedSize || maxCost < MAX_COST_DEFAULT) && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          )}
        </div>
      </main>

      {/* Plot Details Modal on Click */}
      <PlotModal
        plot={selectedPlot}
        onClose={() => setSelectedPlot(null)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-5 text-center text-xs text-slate-500">
        <p>© 2026 Real Estate Plot Layout. All rights reserved.</p>
      </footer>
    </div>
  );
}
