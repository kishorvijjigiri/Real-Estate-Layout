'use client';

import React, { useState, useRef } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { formatCurrency, formatSqFt } from '@/utils/formatters';

export default function MasterPlanLayout({
  allPlots = [],
  filteredPlotIds = new Set(),
  selectedPlot,
  onSelectPlot,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  // Zoom handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.9));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.9), 3));
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
    if (hoveredPlot) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch pan handlers for mobile devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Plot hover
  const handlePlotMouseEnter = (plot, e) => {
    setHoveredPlot(plot);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handlePlotMouseLeave = () => {
    setHoveredPlot(null);
    setTooltipPos(null);
  };

  // Status colors helper
  const getPlotColors = (plot, isMatched) => {
    if (!isMatched) {
      return {
        fill: 'rgba(30, 41, 59, 0.2)',
        stroke: 'rgba(71, 85, 105, 0.3)',
        opacity: 0.2,
        textColor: '#64748b',
      };
    }

    switch (plot.status) {
      case 'available':
        // Available (Gray)
        return {
          fill: 'rgba(100, 116, 139, 0.78)',
          stroke: '#e2e8f0',
          opacity: 0.95,
          textColor: '#ffffff',
        };
      case 'booked':
        // Booked (Green)
        return {
          fill: 'rgba(34, 197, 94, 0.85)',
          stroke: '#86efac',
          opacity: 0.95,
          textColor: '#052e16',
        };
      case 'sold':
        // Sold (Disabled / Coral Red)
        return {
          fill: 'rgba(234, 88, 12, 0.82)',
          stroke: '#fdba74',
          opacity: 0.85,
          textColor: '#ffffff',
        };
      default:
        return {
          fill: 'rgba(100, 116, 139, 0.7)',
          stroke: '#94a3b8',
          opacity: 0.9,
          textColor: '#ffffff',
        };
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onWheel={handleWheel}
      className={`relative w-full h-[520px] sm:h-[620px] lg:h-[700px] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Pan / Zoom Viewport Layer */}
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      >
        <div className="relative w-full max-w-[1024px] aspect-[1024/545] shadow-2xl">
          {/* 1. Master Layout Aerial Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/layout-map.jpg"
            alt="Real Estate Plot Layout"
            className="w-full h-full object-contain pointer-events-none rounded-lg"
            draggable={false}
          />

          {/* 2. SVG Plot Grid Overlay directly on top of the image */}
          <svg
            viewBox="0 0 1024 545"
            className="absolute inset-0 w-full h-full pointer-events-auto"
            preserveAspectRatio="none"
          >
            {allPlots.map((plot) => {
              const { x, y, width, height } = plot.mapCoords;
              const isMatched = filteredPlotIds.has(plot.id);
              const isSelected = selectedPlot?.id === plot.id;
              const isHovered = hoveredPlot?.id === plot.id;
              const colors = getPlotColors(plot, isMatched);

              return (
                <g
                  key={plot.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredPlot(null);
                    if (onSelectPlot) onSelectPlot(plot);
                  }}
                  onMouseEnter={(e) => handlePlotMouseEnter(plot, e)}
                  onMouseLeave={handlePlotMouseLeave}
                >
                  {/* Plot Parcel Rectangle */}
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx="1.5"
                    fill={colors.fill}
                    stroke={isSelected ? '#00f2fe' : isHovered ? '#ffffff' : colors.stroke}
                    strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                    opacity={colors.opacity}
                  />

                  {/* Plot Number Label */}
                  {scale >= 0.95 && (
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 3}
                      textAnchor="middle"
                      fontSize={width < 18 ? '6' : '7.5'}
                      fill={isMatched ? colors.textColor : '#64748b'}
                      fontWeight="700"
                      className="pointer-events-none select-none font-mono"
                    >
                      {plot.number}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Floating Tooltip (matching reference image EXACTLY) */}
      {hoveredPlot && tooltipPos && (() => {
        const isNearTop = tooltipPos.y < 170;
        return (
          <div
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: isNearTop ? 'translate(-50%, 16px)' : 'translate(-50%, -100%) translateY(-14px)',
            }}
            className="fixed z-50 pointer-events-none w-72 max-w-[calc(100vw-2rem)] bg-[#23272f]/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 text-xs text-white"
          >
            {/* Top Badge matching screenshot: [Plot No: 200] */}
            <div className="mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                  hoveredPlot.status === 'booked'
                    ? 'bg-[#86efac] text-[#052e16]'
                    : hoveredPlot.status === 'available'
                    ? 'bg-slate-300 text-slate-900'
                    : 'bg-rose-500 text-white'
                }`}
              >
                Plot No: {hoveredPlot.number}
              </span>
            </div>

            {/* Metric Rows with exact labels and spacing from reference image */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Total Area Sq:</span>
                <span className="font-bold text-white font-mono">{formatSqFt(hoveredPlot.size)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Rate Per Sq:</span>
                <span className="font-bold text-white font-mono">₹{hoveredPlot.rate.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-start pt-1">
                <div>
                  <div className="text-slate-300 font-medium">Total Booking Cost</div>
                  <div className="text-[10px] text-slate-400 font-normal">(With GST)</div>
                </div>
                <span className="font-bold text-white font-mono">
                  {formatCurrency(hoveredPlot.totalCost || (hoveredPlot.size * hoveredPlot.rate))}
                </span>
              </div>
            </div>

            {/* Pointer triangle */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent ${
                isNearTop
                  ? '-top-2 border-b-8 border-b-[#23272f]'
                  : '-bottom-2 border-t-8 border-t-[#23272f]'
              }`}
            />
          </div>
        );
      })()}

      {/* 4. Zoom Controls on Bottom-Right (matching reference screenshots) */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center bg-slate-900/90 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-2xl gap-1 text-slate-300">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono text-slate-400 px-1 select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={handleReset}
          className="w-8 h-8 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
