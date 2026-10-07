import React, { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { generateItems } from '../data/mockData';
import { CodeSnippet } from './CodeSnippet';
import { Boxes, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const TanStackVirtualDemo: React.FC = () => {
  const [itemsCount] = useState(10000);
  const items = React.useMemo(() => generateItems(itemsCount), [itemsCount]);
  const parentRef = useRef<HTMLDivElement>(null);

  // TanStack Virtual hook
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const tanstackCode = `import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function ProductionList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);

  // TanStack Virtual Headless Hook
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // estimated row height
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{ height: '400px', overflowY: 'auto' }}
    >
      <div
        style={{
          height: \`\${virtualizer.getTotalSize()}px\`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: \`\${virtualRow.size}px\`,
              transform: \`translateY(\${virtualRow.start}px)\`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                Production Pattern
              </span>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-400" />
                Industry Standard: @tanstack/react-virtual
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Headless virtualization for React. Supports dynamic item sizes, window scrolling, grids, and horizontal lists.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-800/40">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Headless & 100% Framework Agnostic</span>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">Dynamic Heights</strong>
              <span className="text-slate-400 text-[11px]">Automatically measures DOM elements if items have variable text.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">Headless UI</strong>
              <span className="text-slate-400 text-[11px]">You control 100% of the HTML, styling, and markup structure.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">Lightweight</strong>
              <span className="text-slate-400 text-[11px]">Tiny bundle footprint (~4-5 kB) compared to older legacy libraries.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Demo + Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Live TanStack Virtual List
              </h3>
              <p className="text-[11px] text-slate-400">
                10,000 items rendered effortlessly
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
              {rowVirtualizer.getVirtualItems().length} in DOM
            </span>
          </div>

          <div
            ref={parentRef}
            className="border border-slate-800 rounded-xl overflow-y-auto bg-slate-950 relative shadow-inner"
            style={{ height: 420 }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = items[virtualRow.index];
                if (!item) return null;
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex items-center justify-between px-4 border-b border-slate-800/50 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: item.avatarColor }}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-200">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.role}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/40">
                      Row #{virtualRow.index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Scrolls smoothly at 60 FPS</span>
            <span className="font-mono text-indigo-400">
              Total height: {rowVirtualizer.getTotalSize().toLocaleString()}px
            </span>
          </div>
        </div>

        {/* Code Snippet (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-400" />
                How to Implement in Your App
              </h3>
              <span className="text-xs font-mono text-slate-400">
                npm i @tanstack/react-virtual
              </span>
            </div>
            <CodeSnippet code={tanstackCode} language="tsx" caption="useVirtualizer Example" />
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200/90 mt-2">
            💡 <strong>Why prefer TanStack Virtual in modern React?</strong> Unlike older libraries that forced rigid table or list wrapper components on you, TanStack gives you a pure headless hook so your CSS, styling, and design system remain 100% untouched.
          </div>
        </div>
      </div>
    </div>
  );
};
