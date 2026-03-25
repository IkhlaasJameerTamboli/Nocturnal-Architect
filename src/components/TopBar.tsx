import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

/**
 * TopBar Component
 * Displays the current view status and provides a consistent header.
 * Uses backdrop-blur for a modern, glass-morphism effect.
 */
const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 z-40 bg-[#0e0e0e]/80 backdrop-blur-xl flex justify-end items-center px-6 md:px-8 border-b border-white/5">
      <div className="flex items-center gap-3">
        <span className="text-xs md:text-sm font-semibold text-on-surface uppercase tracking-widest opacity-80">
          Main Status Dashboard
        </span>
      </div>
    </header>
  );
};

export default TopBar;
