import type { SlideContent } from '../types';

export const PRESENTATION_SLIDES: SlideContent[] = [
  {
    id: 1,
    title: 'Virtualization in React',
    subtitle: 'Rendering Massive Lists at 60 FPS Without Crashing the Browser',
    badge: 'Presentation',
    cards: [
      {
        title: 'The Challenge',
        description: 'Rendering 10,000+ items in standard React creates 10,000+ real DOM elements, eating RAM and freezing scrolling.',
        tag: 'Problem',
      },
      {
        title: 'The Solution',
        description: 'Virtualization (also called "Windowing") renders ONLY the items currently visible inside the viewport window (~10-20 items).',
        tag: 'Concept',
        highlight: true,
      },
      {
        title: 'Live Interactive Demos',
        description: 'We will explore 2 simple examples: a side-by-side performance benchmark and a transparent "under-the-hood" custom virtualizer.',
        tag: 'Demos',
      },
    ],
  },
  {
    id: 2,
    title: 'The Problem: The Heavy DOM',
    subtitle: 'Why React and the browser struggle with large lists',
    badge: 'Why Virtualize?',
    visualDiagramType: 'dom-comparison',
    cards: [
      {
        title: '1. Massive Memory Footprint',
        description: 'Every HTML node in the DOM carries dozens of properties, event listeners, and styling computation costs.',
        tag: 'Memory',
      },
      {
        title: '2. Costly Layout & Reflow',
        description: 'Whenever anything updates or the user scrolls, the browser recalculates layout geometry across the entire massive DOM tree.',
        tag: 'CPU',
      },
      {
        title: '3. Stutter & Dropped Frames',
        description: 'Scrolling drops from a silky 60 FPS to 15-20 FPS because the main JavaScript thread is overwhelmed managing thousands of unneeded nodes.',
        tag: 'UX Failure',
        highlight: true,
      },
    ],
    quickAction: {
      label: 'View Live Benchmark (Example 1)',
      targetTab: 'example1',
    },
  },
  {
    id: 3,
    title: 'The Concept: Virtualization (Windowing)',
    subtitle: 'Render ONLY what the user can actually see on screen',
    badge: 'Core Idea',
    visualDiagramType: 'flow',
    cards: [
      {
        title: 'The Invisible Viewport',
        description: 'A scrollable outer container with a fixed height (e.g. 500px) that acts as the "camera" window.',
        tag: 'Viewport',
      },
      {
        title: 'The Phantom Spacer',
        description: 'An inner dummy element set to the full height (Total Items × Item Height) to keep the browser scrollbar natural.',
        tag: 'Scrollbar Track',
      },
      {
        title: 'The Sliding Slice',
        description: 'Only the 10-15 items matching the current scroll offset are rendered into the DOM, shifting dynamically as you scroll.',
        tag: 'DOM Recycled',
        highlight: true,
      },
    ],
  },
  {
    id: 4,
    title: 'The Mechanics: How It Works Under The Hood',
    subtitle: 'The math is surprisingly simple and requires no magic',
    badge: 'The Math',
    visualDiagramType: 'math',
    codeSnippet: {
      language: 'tsx',
      caption: 'The 4 Core Equations of Virtualization',
      code: `// 1. Total height to keep natural scrollbar
const totalHeight = items.length * itemHeight;

// 2. Which item is at the top of the viewport?
const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);

// 3. Which item is at the bottom of the viewport?
const endIndex = Math.min(
  items.length - 1,
  Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
);

// 4. Position the visible items correctly inside the spacer
const offsetY = startIndex * itemHeight;
const visibleItems = items.slice(startIndex, endIndex + 1);`,
    },
    cards: [
      {
        title: 'Overscan / Buffer Items',
        description: 'Rendering 2 to 5 extra items above and below the visible edge prevents blank white flashes during fast flick-scrolling.',
        tag: 'Smoothness',
      },
      {
        title: 'Transform Offset',
        description: 'Using CSS translateY(offsetY) is hardware-accelerated by the GPU and avoids repeated layout reflows.',
        tag: 'Performance',
      },
    ],
    quickAction: {
      label: 'Explore Interactive Visualizer (Example 2)',
      targetTab: 'example2',
    },
  },
  {
    id: 5,
    title: 'Our Two Simple Examples',
    subtitle: 'Clear, real-time demonstrations of virtualization in action',
    badge: 'Live Demonstrations',
    cards: [
      {
        title: 'Example 1: Direct Benchmark',
        description: 'Side-by-side comparison between Normal rendering vs Virtualized rendering with 10,000+ items. Observe DOM node counts and render latency.',
        tag: 'Comparison',
        highlight: true,
      },
      {
        title: 'Example 2: Interactive "Under the Hood"',
        description: 'A zero-library custom virtual list with an X-Ray blueprint inspector showing viewport slicing, overscan buffers, and live math variables.',
        tag: 'Architecture',
        highlight: true,
      },
    ],
  },
  {
    id: 6,
    title: 'Libraries vs Custom Code',
    subtitle: 'When should you build your own vs use an established library?',
    badge: 'Ecosystem',
    visualDiagramType: 'ecosystem',
    cards: [
      {
        title: 'Custom Hook / Component',
        description: 'Great for simple fixed-height lists, educational understanding, zero bundle weight (~1KB), and complete architectural control.',
        tag: 'Build Your Own',
      },
      {
        title: '@tanstack/react-virtual',
        description: 'The modern standard: headless, framework-agnostic, supports dynamic element heights, smooth window scrolling, and grid layouts.',
        tag: 'Recommended Library',
        highlight: true,
      },
      {
        title: 'react-window',
        description: 'Battle-tested, lightweight library by Brian Vaughn. Excellent for fixed or variable size lists and tables.',
        tag: 'Classic Library',
      },
    ],
    quickAction: {
      label: 'View TanStack Virtual Example',
      targetTab: 'tanstack',
    },
  },
  {
    id: 7,
    title: 'Important Trade-offs & Best Practices',
    subtitle: 'What you need to keep in mind when virtualizing',
    badge: 'Gotchas & Tips',
    visualDiagramType: 'checklist',
    cards: [
      {
        title: '🔍 In-Page Search (Ctrl + F)',
        description: 'Because off-screen DOM nodes are unmounted, native browser Ctrl+F cannot find them. Solution: provide a built-in search/filter input.',
        tag: 'Searchability',
      },
      {
        title: '♿ Accessibility (a11y)',
        description: 'Screen readers can only read mounted elements. Use aria-rowcount, aria-rowindex, and announcements for accessibility compliance.',
        tag: 'Accessibility',
      },
      {
        title: '📏 Dynamic Heights',
        description: 'If rows have dynamic heights (e.g. variable text length), you need dynamic size measurement or an estimated height cache.',
        tag: 'Measurement',
      },
      {
        title: '🏎️ Avoid Heavy Rerenders',
        description: 'Ensure row items are memoized or lightweight so fast scrolling does not trigger unneeded React reconciliation overhead.',
        tag: 'Optimization',
      },
    ],
  },
  {
    id: 8,
    title: 'Key Takeaways & Summary',
    subtitle: 'Everything you need to remember about virtualization',
    badge: 'Summary',
    cards: [
      {
        title: 'The Golden Rule',
        description: 'Never mount 10,000 DOM nodes when a user can only look at 10 items at once.',
        tag: 'Rule 1',
        highlight: true,
      },
      {
        title: 'DOM Count Stays Constant',
        description: 'Whether your dataset has 1,000 or 1,000,000 items, the DOM node count remains constant (~15-20 nodes).',
        tag: 'Rule 2',
      },
      {
        title: 'Simple Math, Huge Gains',
        description: 'A simple division of scrollTop by itemHeight turns an unresponsive tab into a buttery 60 FPS experience.',
        tag: 'Rule 3',
      },
    ],
    quickAction: {
      label: 'Go to Benchmark Demo',
      targetTab: 'example1',
    },
  },
];
