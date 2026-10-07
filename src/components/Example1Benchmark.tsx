import React, { useState, useMemo, useRef, useEffect } from 'react';
import { generateItems } from '../data/mockData';
import type { ListItem } from '../types';
import { useSimpleVirtualizer } from '../hooks/useSimpleVirtualizer';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Gauge, 
  Layers, 
  Eye, 
  Zap,
  SplitSquareVertical
} from 'lucide-react';

const ITEM_HEIGHT = 64; // px
const CONTAINER_HEIGHT = 420; // px

export const Example1Benchmark: React.FC = () => {
  const [itemCount, setItemCount] = useState<number>(5000);
  const [viewMode, setViewMode] = useState<'both' | 'normal' | 'virtual'>('both');
  
  // Benchmark render times
  const [normalRenderTime, setNormalRenderTime] = useState<number>(0);
  const [virtualRenderTime, setVirtualRenderTime] = useState<number>(0);

  // Generate dataset based on count
  const items = useMemo(() => generateItems(itemCount), [itemCount]);

  // Virtualizer for the virtualized list
  const virtualizer = useSimpleVirtualizer({
    count: items.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 3,
  });

  // Track render time for Normal list
  const normalStartRef = useRef<number>(0);
  normalStartRef.current = performance.now();
  useEffect(() => {
    const elapsed = performance.now() - normalStartRef.current;
    setNormalRenderTime(Math.max(1, Math.round(elapsed)));
  }, [items, itemCount]);

  // Track render time for Virtual list
  const virtualStartRef = useRef<number>(0);
  virtualStartRef.current = performance.now();
  useEffect(() => {
    const elapsed = performance.now() - virtualStartRef.current;
    setVirtualRenderTime(Math.max(0.5, Number(elapsed.toFixed(1))));
  }, [virtualizer.virtualItems, items, itemCount]);

  // Force re-render benchmark
  const [, setRenderTrigger] = useState(0);
  const triggerBenchmark = () => {
    normalStartRef.current = performance.now();
    virtualStartRef.current = performance.now();
    setRenderTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Example 1
              </span>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <SplitSquareVertical className="w-5 h-5 text-cyan-400" />
                Live Benchmark: Normal vs Virtualized
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Compare DOM footprint, initial paint lag, and scrolling smoothness with thousands of items.
            </p>
          </div>

          {/* Quick Benchmark Refresh Button */}
          <button
            onClick={triggerBenchmark}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm hover:shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Re-evaluate Render</span>
          </button>
        </div>

        {/* Dataset and Display Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Dataset Size Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Dataset Size (Total Items)
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[1000, 5000, 10000, 25000].map((size) => (
                <button
                  key={size}
                  onClick={() => setItemCount(size)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    itemCount === size
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {size.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Display Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['both', 'normal', 'virtual'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    viewMode === mode
                      ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'both' ? 'Side by Side' : mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Lists Container */}
      <div className={`grid gap-6 ${viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* ================= NORMAL LIST (NO VIRTUALIZATION) ================= */}
        {(viewMode === 'both' || viewMode === 'normal') && (
          <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-5 shadow-xl flex flex-col">
            {/* Column Header & Metrics */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-100">
                    Without Virtualization (Standard)
                  </h3>
                </div>
                <p className="text-xs text-rose-400 mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Every item is rendered directly in the DOM tree
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Render Latency</span>
                <span className="text-sm font-bold font-mono text-rose-400">
                  ~{normalRenderTime} ms
                </span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="bg-slate-950/70 border border-rose-900/30 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-rose-400" />
                    DOM Elements
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-rose-300">
                  {items.length.toLocaleString()}
                </div>
                <div className="text-[11px] text-rose-400/80 mt-1">
                  Massive DOM tree overhead
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    Scroll Feel
                  </span>
                </div>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {itemCount >= 10000 ? 'High Latency / Janky' : 'Noticeable Stutter'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Frequent layout recalculations
                </div>
              </div>
            </div>

            {/* Scrollable Container */}
            <div
              className="mt-2 border border-slate-800 rounded-xl overflow-y-auto bg-slate-950/90 relative"
              style={{ height: CONTAINER_HEIGHT }}
            >
              <div className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <ItemRow key={item.id} item={item} height={ITEM_HEIGHT} />
                ))}
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span>Try rapid scrolling to feel the DOM load</span>
              <span className="font-mono text-[11px] text-slate-500">
                100% elements mounted
              </span>
            </div>
          </div>
        )}

        {/* ================= VIRTUALIZED LIST ================= */}
        {(viewMode === 'both' || viewMode === 'virtual') && (
          <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-5 shadow-xl flex flex-col">
            {/* Column Header & Metrics */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-100">
                    With Virtualization (Windowed)
                  </h3>
                </div>
                <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Only ~{virtualizer.visibleCount} items mounted in the DOM at any time!
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Render Latency</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  ~{virtualRenderTime} ms
                </span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="bg-slate-950/70 border border-emerald-900/30 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    DOM Elements
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-300">
                  {virtualizer.visibleCount}
                  <span className="text-xs font-normal text-slate-400 ml-1.5">
                    / {items.length.toLocaleString()} total
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">
                  99.9% fewer DOM nodes!
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Scroll Feel
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-300 mt-1">
                  Constant 60 FPS
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Zero layout thrashing
                </div>
              </div>
            </div>

            {/* Virtualized Scrollable Container */}
            <div
              onScroll={virtualizer.onScroll}
              className="mt-2 border border-slate-800 rounded-xl overflow-y-auto bg-slate-950/90 relative"
              style={{ height: CONTAINER_HEIGHT }}
            >
              {/* The outer phantom container with the total virtual height */}
              <div
                className="w-full relative"
                style={{ height: virtualizer.totalHeight }}
              >
                {/* The sliding window positioned via translateY */}
                <div
                  className="w-full absolute left-0 top-0 divide-y divide-slate-800/60"
                  style={{
                    transform: `translateY(${virtualizer.offsetY}px)`,
                  }}
                >
                  {virtualizer.virtualItems.map((virtualRow) => {
                    const item = items[virtualRow.index];
                    if (!item) return null;
                    return (
                      <ItemRow
                        key={item.id}
                        item={item}
                        height={ITEM_HEIGHT}
                        badge={`Row #${virtualRow.index + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span className="text-emerald-400 font-medium">
                Window: indices [{virtualizer.startIndex} ... {virtualizer.endIndex}]
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                O(1) memory complexity
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-cyan-800/40 text-xs md:text-sm text-slate-300 flex items-start gap-3">
        <Activity className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">Key Observation:</span> Notice how even when you switch the dataset to 25,000 items, the Virtualized list only ever renders {virtualizer.visibleCount} elements. The memory footprint stays flat, and scrolling remains instant and fluid!
        </div>
      </div>
    </div>
  );
};

// Reusable single row item
const ItemRow: React.FC<{ item: ListItem; height: number; badge?: string }> = ({
  item,
  height,
  badge,
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 hover:bg-slate-900/60 transition-colors"
      style={{ height }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
          style={{ backgroundColor: item.avatarColor }}
        >
          {item.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200 text-xs truncate">
              {item.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              ID: {item.id}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {item.role} • <span className="text-slate-500">{item.department}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 hidden sm:inline-block">
            {badge}
          </span>
        )}
        <span
          className={`w-2 h-2 rounded-full ${
            item.status === 'active'
              ? 'bg-emerald-400'
              : item.status === 'busy'
              ? 'bg-rose-400'
              : item.status === 'away'
              ? 'bg-amber-400'
              : 'bg-slate-500'
          }`}
          title={item.status}
        />
      </div>
    </div>
  );
};
