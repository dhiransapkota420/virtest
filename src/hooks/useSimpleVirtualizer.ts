import { useState, useCallback, useMemo } from 'react';

export interface SimpleVirtualizerOptions {
  count: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualRow {
  index: number;
  top: number;
  height: number;
}

export function useSimpleVirtualizer({
  count,
  itemHeight,
  containerHeight,
  overscan = 2,
}: SimpleVirtualizerOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  // Handle scroll event from the container
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Total height of the virtual container (preserves native scrollbar)
  const totalHeight = count * itemHeight;

  // Calculate visible range
  const { startIndex, endIndex, virtualItems, offsetY } = useMemo(() => {
    // 1. First visible item index minus buffer
    const rawStartIndex = Math.floor(scrollTop / itemHeight);
    const start = Math.max(0, rawStartIndex - overscan);

    // 2. Last visible item index plus buffer
    const rawEndIndex = Math.floor((scrollTop + containerHeight) / itemHeight);
    const end = Math.min(count - 1, rawEndIndex + overscan);

    // 3. Offset to place items correctly in the scrollable space
    const offset = start * itemHeight;

    // 4. Generate the small slice of items to render
    const items: VirtualRow[] = [];
    if (count > 0) {
      for (let i = start; i <= end; i++) {
        items.push({
          index: i,
          top: i * itemHeight,
          height: itemHeight,
        });
      }
    }

    return {
      startIndex: start,
      endIndex: end,
      virtualItems: items,
      offsetY: offset,
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, count]);

  return {
    scrollTop,
    onScroll,
    totalHeight,
    startIndex,
    endIndex,
    virtualItems,
    offsetY,
    visibleCount: virtualItems.length,
  };
}
