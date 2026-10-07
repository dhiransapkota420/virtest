import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';
import type { ActiveTab, SlideContent } from '../types';
import { CodeSnippet } from './CodeSnippet';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PresentationDeckProps {
  onNavigateToTab: (tab: ActiveTab) => void;
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({
  onNavigateToTab,
  currentSlideIndex,
  onSlideChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  const totalSlides = PRESENTATION_SLIDES.length;
  const slide: SlideContent = PRESENTATION_SLIDES[currentSlideIndex] || PRESENTATION_SLIDES[0];

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      onSlideChange(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, totalSlides, onSlideChange]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  }, [currentSlideIndex, onSlideChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      deckRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div
      ref={deckRef}
      className={`relative flex flex-col justify-between ${
        isFullscreen ? 'h-screen bg-slate-950 p-6 md:p-10' : 'min-h-[640px]'
      }`}
    >
      {/* Slide Progress Bar */}
      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Main Slide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl flex-1 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
        {/* Glow ambient background effect */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                {slide.badge || 'Slide'}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {currentSlideIndex + 1} of {totalSlides}
              </span>
            </div>

            {/* Quick Action Link to Live Demo */}
            {slide.quickAction && (
              <button
                onClick={() => onNavigateToTab(slide.quickAction!.targetTab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.quickAction.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Slide Body / Visual Diagrams / Cards */}
        <div className="my-6 relative z-10 flex-1 flex flex-col justify-center">
          {/* Visual Diagram: DOM Comparison */}
          {slide.visualDiagramType === 'dom-comparison' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-center">
                <div className="text-rose-400 font-bold text-sm mb-1 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Without Virtualization
                </div>
                <div className="text-3xl font-extrabold font-mono text-rose-300 my-2">
                  10,000+ DOM Nodes
                </div>
                <p className="text-xs text-rose-300/70">
                  Browser creates 10,000 real HTML nodes in memory, causing laggy paint, memory spikes, and stuttering scroll.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-center">
                <div className="text-emerald-400 font-bold text-sm mb-1 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> With Virtualization
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-300 my-2">
                  ~15 DOM Nodes
                </div>
                <p className="text-xs text-emerald-300/70">
                  Only the visible window is rendered. DOM node count stays flat regardless of how large the dataset grows!
                </p>
              </div>
            </div>
          )}

          {/* Visual Diagram: Flow */}
          {slide.visualDiagramType === 'flow' && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
              <div className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">1. Outer Container</span>
                <span className="text-xs font-bold text-cyan-300">Scrollable Viewport</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Fixed height, overflow-y: auto</span>
              </div>
              <span className="text-slate-600 font-bold hidden md:inline">➔</span>
              <div className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">2. Phantom Spacer</span>
                <span className="text-xs font-bold text-blue-300">Total Height Placeholder</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">height: count × itemHeight</span>
              </div>
              <span className="text-slate-600 font-bold hidden md:inline">➔</span>
              <div className="flex-1 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block">3. Rendered Slice</span>
                <span className="text-xs font-bold text-emerald-300">Sliding Window (~15 items)</span>
                <span className="text-[11px] text-emerald-400/70 block mt-0.5">transform: translateY(offsetY)</span>
              </div>
            </div>
          )}

          {/* Code Snippet if present */}
          {slide.codeSnippet && (
            <div className="mb-4">
              <CodeSnippet
                code={slide.codeSnippet.code}
                language={slide.codeSnippet.language}
                caption={slide.codeSnippet.caption}
              />
            </div>
          )}

          {/* Cards Grid */}
          {slide.cards && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {slide.cards.map((card, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border transition-all ${
                    card.highlight
                      ? 'bg-gradient-to-b from-cyan-950/50 to-blue-950/30 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {card.tag && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          card.highlight
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {card.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm md:text-base mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Footer Controls Bar */}
        <div className="relative z-10 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>

            {/* Slide Quick Jump Dots */}
            <div className="hidden md:flex items-center gap-1.5">
              {PRESENTATION_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onSlideChange(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlideIndex === idx
                      ? 'w-6 bg-cyan-400'
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  currentSlideIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentSlideIndex === totalSlides - 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-900 border border-slate-800 text-slate-500'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
