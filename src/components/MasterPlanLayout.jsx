'use client';

import React, { useState, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { formatCurrency, formatSqFt } from '@/utils/formatters';

export default function MasterPlanLayout({
  allPlots = [],
  filteredPlotIds = new Set(),
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  // Zoom handlers (ONLY via + and - buttons)
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.9));

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

  // Status colors helper (White Theme)
  const getPlotColors = (plot, isMatched) => {
    if (!isMatched) {
      return {
        fill: 'rgba(203, 213, 225, 0.3)',
        stroke: 'rgba(148, 163, 184, 0.4)',
        opacity: 0.3,
        textColor: '#94a3b8',
      };
    }

    switch (plot.status) {
      case 'available':
        return {
          fill: 'rgba(148, 163, 184, 0.75)',
          stroke: '#475569',
          opacity: 0.95,
          textColor: '#ffffff',
        };
      case 'booked':
        return {
          fill: 'rgba(34, 197, 94, 0.8)',
          stroke: '#16a34a',
          opacity: 0.95,
          textColor: '#ffffff',
        };
      case 'sold':
        return {
          fill: 'rgba(239, 68, 68, 0.8)',
          stroke: '#dc2626',
          opacity: 0.85,
          textColor: '#ffffff',
        };
      default:
        return {
          fill: 'rgba(148, 163, 184, 0.7)',
          stroke: '#64748b',
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
      className={`relative w-full h-[520px] sm:h-[620px] lg:h-[700px] bg-gray-100 rounded border border-gray-300 overflow-hidden select-none ${
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
        <div className="relative w-full max-w-[1024px] aspect-[1024/545]">
          {/* Master Layout Aerial Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/layout-map.jpg"
            alt="Real Estate Plot Layout"
            className="w-full h-full object-contain pointer-events-none rounded"
            draggable={false}
          />

          {/* SVG Plot Grid Overlay directly on top of the image */}
          <svg
            viewBox="0 0 1024 545"
            className="absolute inset-0 w-full h-full pointer-events-auto"
            preserveAspectRatio="none"
          >
            {allPlots.map((plot) => {
              const { x, y, width, height } = plot.mapCoords;
              const isMatched = filteredPlotIds.has(plot.id);
              const isHovered = hoveredPlot?.id === plot.id;
              const colors = getPlotColors(plot, isMatched);

              return (
                <g
                  key={plot.id}
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
                    stroke={isHovered ? '#0f172a' : colors.stroke}
                    strokeWidth={isHovered ? '2' : '1'}
                    opacity={colors.opacity}
                  />

                  {/* Plot Number Label */}
                  {scale >= 0.95 && (
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 3}
                      textAnchor="middle"
                      fontSize={width < 18 ? '6' : '7.5'}
                      fill={isMatched ? colors.textColor : '#94a3b8'}
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

      {/* Floating Hover Tooltip */}
      {hoveredPlot && tooltipPos && (() => {
        const isNearTop = tooltipPos.y < 160;
        return (
          <div
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: isNearTop ? 'translate(-50%, 12px)' : 'translate(-50%, -100%) translateY(-12px)',
            }}
            className="fixed z-50 pointer-events-none w-64 bg-white rounded border border-gray-300 p-3 shadow-md text-xs text-gray-900"
          >
            <div className="mb-2 pb-1 border-b border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-900">
                Plot #{hoveredPlot.number}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] capitalize font-medium ${
                  hoveredPlot.status === 'booked'
                    ? 'bg-green-100 text-green-800'
                    : hoveredPlot.status === 'available'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {hoveredPlot.status}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Area:</span>
                <span className="font-mono text-gray-800">{formatSqFt(hoveredPlot.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rate:</span>
                <span className="font-mono text-gray-800">₹{hoveredPlot.rate.toLocaleString('en-IN')}/sq.ft</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-100">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-mono text-gray-900">
                  {formatCurrency(hoveredPlot.totalCost || (hoveredPlot.size * hoveredPlot.rate))}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Zoom Controls: ONLY [-] and [+] buttons */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center bg-white border border-gray-300 rounded p-1 gap-1 text-gray-700 shadow-sm">
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center cursor-pointer text-gray-700"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center cursor-pointer text-gray-700"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}



