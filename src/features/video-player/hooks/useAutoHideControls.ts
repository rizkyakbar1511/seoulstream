"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseAutoHideControlsParams = {
  delay?: number;
  isPlaying: boolean;
};

export function useAutoHideControls({
  delay = 2500,
  isPlaying,
}: UseAutoHideControlsParams) {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  const isInteractingRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showControls = useCallback(() => {
    setVisible(true);
    clearTimer();

    if (!isPlaying) return;

    timeoutRef.current = window.setTimeout(() => {
      if (isInteractingRef.current) return;
      setVisible(false);
    }, delay);
  }, [clearTimer, delay, isPlaying]);

  const startInteracting = useCallback(() => {
    isInteractingRef.current = true;
    setVisible(true);
    clearTimer();
  }, [clearTimer]);

  const stopInteracting = useCallback(() => {
    isInteractingRef.current = false;
    showControls(); // restart timer
  }, [showControls]);

  const hideControls = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  useEffect(() => {
    // when paused → always show
    if (!isPlaying) {
      clearTimer();
      setVisible(true);
      return;
    }

    // when playing → start timer
    showControls();

    return () => clearTimer();
  }, [isPlaying, showControls, clearTimer]);

  return {
    visible,
    showControls,
    hideControls,
    startInteracting,
    stopInteracting,
  };
}
