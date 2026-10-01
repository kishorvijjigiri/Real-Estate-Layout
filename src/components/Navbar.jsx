'use client';

import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight">
             Real Estate Plot Layout
          </h1>
        </div>
      </div>
    </header>
  );
}
