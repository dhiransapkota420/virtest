import React, { useState, useRef, useMemo } from 'react';
import { 
  Code2, 
  Sliders, 
  HelpCircle, 
  ArrowDownUp, 
  Sparkles,
  Compass
} from 'lucide-react';
import { CodeSnippet } from './CodeSnippet';

export const Example2CustomVirtualizer: React.FC = () => {
  // Configurable parameters
  const [totalCount, setTotalCount] = useState<number>(200);
  const [itemHeight, setItemHeight] = useState<number>(50);
  const [containerHeight, setContainerHeight] = useState<number>(320);
  const [overscan, setOverscan] = useState<number>(2);
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'code'>('visual');

  // Track scroll position
  const [scrollTop, setScrollTop] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Core Virtualization Math
  const totalHeight = totalCount * itemHeight;
  
  // Math steps calculated
  const rawStartIndex = Math.floor(scrollTop / itemHeight);
  const startIndex = Math.max(0, rawStartIndex - overscan);

  const rawEndIndex = Math.floor((scrollTop + containerHeight) / itemHeight);
  const endIndex = Math.min(totalCount - 1, rawEndIndex + overscan);

  const offsetY = startIndex * itemHeight;
  const visibleCount = Math.max(0, endIndex - startIndex + 1);

  // Generate slice of items to render
  const visibleItems = useMemo(() => {
    const list = [];
    for (let i = startIndex; i <= endIndex; i++) {
      list.push(i);
    }
    return list;
  }, [startIndex, endIndex]);

  // Handle scroll event
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Quick scroll helper
  const scrollToItem = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = index * itemHeight;
    }
  };

  // Blueprint diagram scale calculation (for mini-map preview)
  const mapHeight = 320;
  const scale = totalHeight > 0 ? mapHeight / totalHeight : 1;
  const mapViewportTop = scrollTop * scale;
  const mapViewportHeight = Math.max(8, containerHeight * scale);
  const mapRenderedTop = offsetY * scale;
  const mapRenderedHeight = Math.max(8, visibleCount * itemHeight * scale);

  const customVirtualizerCode = `// A complete, working React Virtual List in ~35 lines of code!
import React, { useState } from 'react';

export function SimpleVirtualList({ items, itemHeight = 50, height = 300, overscan = 2 }) {
  const [scrollTop, setScrollTop] = useState(0);

  // 1. Calculate the total height to maintain native scrollbar
  const totalHeight = items.length * itemHeight;

  // 2. Compute which indices are currently inside the viewport
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );

  // 3. Compute the offset to push visible items down to the right spot
  const offsetY = startIndex * itemHeight;
  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ height, overflowY: 'auto', position: 'relative' }}
    >
      {/* Phantom spacer keeps scrollbar height accurate */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Render ONLY the visible items at the calculated translateY */}
        <div style={{ transform: \`translateY(\${offsetY}px)\`, position: 'absolute', width: '100%' }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {item.name} (Index #{startIndex + i})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                Example 2
              </span>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                Under the Hood: Custom Virtualizer & X-Ray
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Zero dependencies. Interactive blueprint showing live variables, overscan buffer, and offset positioning.
            </p>
          </div>

          {/* Sub-tab toggle */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'visual'
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Blueprint</span>
            </button>
            <button
              onClick={() => setActiveSubTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'code'
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Clean Code (~35 lines)</span>
            </button>
          </div>
        </div>

        {/* Live Variable Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
          {/* Total Items */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-slate-400 mb-1.5">
              <span className="font-semibold flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" /> Total Items (N)
              </span>
              <span className="font-mono text-cyan-400 font-bold">{totalCount}</span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={totalCount}
              onChange={(e) => setTotalCount(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>50</span>
              <span>500</span>
              <span>1,000</span>
            </div>
          </div>

          {/* Row Height */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-slate-400 mb-1.5">
              <span className="font-semibold">Row Height (px)</span>
              <span className="font-mono text-cyan-400 font-bold">{itemHeight}px</span>
            </div>
            <input
              type="range"
              min={35}
              max={80}
              step={5}
              value={itemHeight}
              onChange={(e) => setItemHeight(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>35px</span>
              <span>50px</span>
              <span>80px</span>
            </div>
          </div>

          {/* Viewport Height */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-slate-400 mb-1.5">
              <span className="font-semibold">Viewport Height (px)</span>
              <span className="font-mono text-cyan-400 font-bold">{containerHeight}px</span>
            </div>
            <input
              type="range"
              min={240}
              max={460}
              step={20}
              value={containerHeight}
              onChange={(e) => setContainerHeight(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>240px</span>
              <span>320px</span>
              <span>460px</span>
            </div>
          </div>

          {/* Overscan Buffer */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-slate-400 mb-1.5">
              <span className="font-semibold">Overscan Buffer</span>
              <span className="font-mono text-emerald-400 font-bold">+{overscan} items</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {[0, 1, 2, 4].map((buf) => (
                <button
                  key={buf}
                  onClick={() => setOverscan(buf)}
                  className={`py-1 rounded text-[11px] font-mono transition-colors ${
                    overscan === buf
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  +{buf}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Prevents blank flickering
            </div>
          </div>
        </div>
      </div>

      {activeSubTab === 'code' ? (
        /* Code Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                The Minimalist Custom Virtualizer
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Copy, understand, and use this lightweight component directly in any React application.
              </p>
            </div>
          </div>
          <CodeSnippet code={customVirtualizerCode} language="tsx" caption="SimpleVirtualList.tsx" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-cyan-300 block mb-1">1. Phantom Spacer</span>
              <p className="text-slate-400 text-[11px]">
                The container div has height <code className="text-cyan-200">totalCount * itemHeight</code>, allowing the browser native scrollbar to behave naturally.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-emerald-300 block mb-1">2. Integer Division</span>
              <p className="text-slate-400 text-[11px]">
                <code className="text-emerald-200">Math.floor(scrollTop / itemHeight)</code> determines the exact item at the top edge instantly.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-blue-300 block mb-1">3. GPU Translation</span>
              <p className="text-slate-400 text-[11px]">
                <code className="text-blue-200">transform: translateY(...)</code> shifts the rendered window down to the active view smoothly.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Blueprint Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Live Virtual List (4 Columns) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Live Scrollable List
                </h3>
                <p className="text-[11px] text-slate-400">
                  Scroll here to see variables update live
                </p>
              </div>

              {/* Quick jump shortcuts */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => scrollToItem(0)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Top
                </button>
                <button
                  onClick={() => scrollToItem(Math.floor(totalCount / 2))}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Middle
                </button>
                <button
                  onClick={() => scrollToItem(totalCount - 1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Bottom
                </button>
              </div>
            </div>

            {/* The scrollable viewport container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="border border-slate-800 rounded-xl overflow-y-auto bg-slate-950 relative shadow-inner"
              style={{ height: containerHeight }}
            >
              {/* Outer dummy spacer */}
              <div
                className="w-full relative"
                style={{ height: totalHeight }}
              >
                {/* Visible window pushed by translateY */}
                <div
                  className="w-full absolute left-0 top-0 divide-y divide-slate-800/80"
                  style={{
                    transform: `translateY(${offsetY}px)`,
                  }}
                >
                  {visibleItems.map((index) => {
                    const isBuffer =
                      index < rawStartIndex ||
                      index > rawEndIndex;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between px-3 text-xs transition-colors ${
                          isBuffer
                            ? 'bg-emerald-950/20 text-emerald-300/80'
                            : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800/60'
                        }`}
                        style={{ height: itemHeight }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400">
                            #{index}
                          </span>
                          <span className="font-medium text-xs">
                            Item Row {index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isBuffer && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/30">
                              Overscan Buffer
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">
                            {index * itemHeight}px
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <ArrowDownUp className="w-3.5 h-3.5 text-cyan-400" />
                Scroll position: <strong className="text-cyan-300 font-mono">{scrollTop}px</strong>
              </span>
              <span className="text-emerald-400 font-mono">
                {visibleCount} nodes in DOM
              </span>
            </div>
          </div>

          {/* Interactive X-Ray / Formula Inspector (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Formula Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Live Math Calculator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Calculation 1: Start Index */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono text-cyan-400 font-semibold mb-1">
                    1. Start Index
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    Math.floor({scrollTop} / {itemHeight}) - {overscan}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-slate-400 text-[11px]">startIndex =</span>
                    <span className="text-lg font-bold font-mono text-cyan-300">{startIndex}</span>
                  </div>
                </div>

                {/* Calculation 2: End Index */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono text-cyan-400 font-semibold mb-1">
                    2. End Index
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    Math.floor(({scrollTop} + {containerHeight}) / {itemHeight}) + {overscan}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-slate-400 text-[11px]">endIndex =</span>
                    <span className="text-lg font-bold font-mono text-cyan-300">{endIndex}</span>
                  </div>
                </div>

                {/* Calculation 3: translateY */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono text-emerald-400 font-semibold mb-1">
                    3. Offset translateY
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    startIndex ({startIndex}) × itemHeight ({itemHeight}px)
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-slate-400 text-[11px]">offsetY =</span>
                    <span className="text-lg font-bold font-mono text-emerald-300">{offsetY}px</span>
                  </div>
                </div>

                {/* Calculation 4: Total Height */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono text-blue-400 font-semibold mb-1">
                    4. Total Phantom Height
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    totalCount ({totalCount}) × itemHeight ({itemHeight}px)
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-slate-400 text-[11px]">totalHeight =</span>
                    <span className="text-lg font-bold font-mono text-blue-300">{totalHeight}px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* X-Ray Mini-Map Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  X-Ray Blueprint (The Entire List in Miniature)
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Scale: {(scale * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex gap-6 items-center">
                {/* Mini-map Track */}
                <div
                  className="w-20 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden shrink-0 shadow-inner"
                  style={{ height: mapHeight }}
                >
                  {/* Unrendered Top Zone */}
                  <div
                    className="absolute top-0 left-0 w-full bg-slate-900/60 border-b border-dashed border-slate-800"
                    style={{ height: mapRenderedTop }}
                  />

                  {/* Active Rendered Window (in DOM) */}
                  <div
                    className="absolute left-0 w-full bg-emerald-500/20 border-y border-emerald-400/80 transition-all duration-75"
                    style={{
                      top: mapRenderedTop,
                      height: mapRenderedHeight,
                    }}
                  />

                  {/* Visible Viewport Window (User's Screen) */}
                  <div
                    className="absolute left-1 right-1 rounded border-2 border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-500/30 transition-all duration-75"
                    style={{
                      top: mapViewportTop,
                      height: mapViewportHeight,
                    }}
                  >
                    <span className="text-[9px] font-bold text-cyan-200 block text-center leading-none mt-1">
                      VIEW
                    </span>
                  </div>
                </div>

                {/* Legend & Breakdown */}
                <div className="space-y-3 text-xs flex-1">
                  <div className="flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded border-2 border-cyan-400 bg-cyan-400/20 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">Viewport Window ({containerHeight}px)</strong>
                      <span className="text-slate-400 text-[11px]">
                        The visible frame the user actually sees on screen.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded border border-emerald-400 bg-emerald-500/20 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 block">Rendered Slice in DOM ({visibleCount} items)</strong>
                      <span className="text-slate-400 text-[11px]">
                        Visible items + buffer overscan. Everything else is unmounted!
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-800 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-400 block">Unrendered Virtual Space</strong>
                      <span className="text-slate-500 text-[11px]">
                        {totalCount - visibleCount} items not in the DOM. Zero memory overhead!
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200/90 mt-2">
                    💡 <strong>Pro Tip:</strong> Try dragging the scrollbar in the list on the left to watch this miniature camera track move in real time!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
