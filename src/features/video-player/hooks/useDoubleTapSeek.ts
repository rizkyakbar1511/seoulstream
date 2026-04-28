"use client";

import { useRef } from "react";

type Params = {
  containerRef: React.RefObject<HTMLElement | null>;
  onSeek: (delta: number) => void;
};

export function useDoubleTapSeek({ containerRef, onSeek }: Params) {
  const lastTapRef = useRef(0);

  const handleDoubleTap = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;

    const now = Date.now();
    const delta = now - lastTapRef.current;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const isLeft = x < rect.width / 2;

    if (delta < 300) {
      onSeek(isLeft ? -5 : 5);
    }

    lastTapRef.current = now;
  };

  return {
    handleDoubleTap,
  };
}
