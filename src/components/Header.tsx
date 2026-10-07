import React from 'react';
import type { ActiveTab } from '../types';
import { 
  TvMinimalPlay, 
  Layers, 
  Cpu, 
  Boxes,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  slideNumber?: number;
  totalSlides?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  slideNumber,
  totalSlides,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'presentation',
      label: 'Presentation Slides',
      icon: <TvMinimalPlay className="w-4 h-4" />,
      badge: slideNumber && totalSlides ? `${slideNumber}/${totalSlides}` : undefined,
    },
    {
      id: 'example1',
      label: 'Example 1: Benchmark',
      icon: <Layers className="w-4 h-4" />,
      badge: 'Normal vs Virtual',
    },
    {
      id: 'example2',
      label: 'Example 2: How It Works',
      icon: <Cpu className="w-4 h-4" />,
      badge: 'Custom & X-Ray',
    },
    {
      id: 'tanstack',
      label: 'TanStack Virtual',
      icon: <Boxes className="w-4 h-4" />,
      badge: 'Production Lib',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base md:text-lg tracking-tight">
              React Virtualization
            </h1>
            <p className="text-xs text-slate-400">
              High Performance Rendering for Large Datasets
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-blue-900/60 text-blue-100 border border-blue-400/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
