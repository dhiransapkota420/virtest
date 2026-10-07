import { useState } from 'react';
import type { ActiveTab } from './types';
import { PRESENTATION_SLIDES } from './data/presentationSlides';
import { Header } from './components/Header';
import { PresentationDeck } from './components/PresentationDeck';
import { Example1Benchmark } from './components/Example1Benchmark';
import { Example2CustomVirtualizer } from './components/Example2CustomVirtualizer';
import { TanStackVirtualDemo } from './components/TanStackVirtualDemo';
import { Presentation, Layers, Cpu, Boxes } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('presentation');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handleNavigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={handleNavigateToTab}
        slideNumber={activeTab === 'presentation' ? currentSlideIndex + 1 : undefined}
        totalSlides={PRESENTATION_SLIDES.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'presentation' && (
          <PresentationDeck
            onNavigateToTab={handleNavigateToTab}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={setCurrentSlideIndex}
          />
        )}

        {activeTab === 'example1' && <Example1Benchmark />}

        {activeTab === 'example2' && <Example2CustomVirtualizer />}

        {activeTab === 'tanstack' && <TanStackVirtualDemo />}
      </main>

      {/* Footer / Presenter Quick Navigation */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400 font-medium">
              React Virtualization
            </span>
            <span className="text-slate-600">•</span>
            <span>Presentation Ready</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => handleNavigateToTab('presentation')}
              className={`hover:text-cyan-300 transition-colors flex items-center gap-1 ${
                activeTab === 'presentation' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slides</span>
            </button>
            <button
              onClick={() => handleNavigateToTab('example1')}
              className={`hover:text-cyan-300 transition-colors flex items-center gap-1 ${
                activeTab === 'example1' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Example 1: Benchmark</span>
            </button>
            <button
              onClick={() => handleNavigateToTab('example2')}
              className={`hover:text-cyan-300 transition-colors flex items-center gap-1 ${
                activeTab === 'example2' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Example 2: How It Works</span>
            </button>
            <button
              onClick={() => handleNavigateToTab('tanstack')}
              className={`hover:text-cyan-300 transition-colors flex items-center gap-1 ${
                activeTab === 'tanstack' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>TanStack Demo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
