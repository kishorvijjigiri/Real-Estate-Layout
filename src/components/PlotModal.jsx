'use client';

import React, { useState } from 'react';
import { formatCurrency, formatSqFt } from '@/utils/formatters';
import { X, CheckCircle2 } from 'lucide-react';

export default function PlotModal({ plot, onClose }) {
  const [bookedSuccess, setBookedSuccess] = useState(false);

  if (!plot) return null;

  const handleBooking = () => {
    setBookedSuccess(true);
  };

  const isAvailable = plot.status === 'available';
  const isBooked = plot.status === 'booked';
  const isSold = plot.status === 'sold';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-cyan-400 font-mono">
              Plot #{plot.number}
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${isAvailable
                  ? 'bg-slate-700 text-white'
                  : isBooked
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-rose-600 text-white'
                }`}
            >
              {plot.status}
            </span>
          </div>
          <p className="text-xs text-slate-400">Real Estate Plot Layout</p>
        </div>

        {/* Details Grid */}
        <div className="bg-slate-950/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300 mb-5 border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Area Sq:</span>
            <span className="font-bold text-white font-mono">{formatSqFt(plot.size)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Rate per Sq.Ft.:</span>
            <span className="font-semibold text-white font-mono">₹{plot.rate.toLocaleString('en-IN')}/sq.ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Dimensions:</span>
            <span className="font-semibold text-white font-mono">{plot.dimensions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Facing Direction:</span>
            <span className="font-semibold text-cyan-300">{plot.facing} Facing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Booking Cost:</span>
            <span className="font-semibold text-emerald-400 font-mono">{formatCurrency(plot.bookingCost)}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
            <span>Total Estimated Cost:</span>
            <span className="text-emerald-400 text-base font-mono">{formatCurrency(plot.totalCost)}</span>
          </div>
        </div>

        {/* Action / Booking state */}
        {bookedSuccess ? (
          <div className="bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs rounded-2xl p-4 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-white">Inquiry Received!</p>
            <p>Our sales representative will reach out with the brochure for Plot #{plot.number}.</p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            {isAvailable ? (
              <button
                onClick={handleBooking}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all uppercase tracking-wider"
              >
                Inquire & Book Plot
              </button>
            ) : isBooked ? (
              <button
                onClick={handleBooking}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
              >
                Join Waiting List
              </button>
            ) : (
              <div className="flex-1 py-2.5 text-center text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs">
                Plot Sold Out
              </div>
            )}
            <button
              onClick={onClose}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
