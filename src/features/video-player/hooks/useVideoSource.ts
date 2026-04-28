"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VideoSource } from "@/features/drama/types";
import type { Quality } from "../types";

type useVideoSourceParams = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  sources?: VideoSource;
  isHdAvailable: boolean;
};

export function useVideoSource({
  videoRef,
  sources,
  isHdAvailable,
}: useVideoSourceParams) {
  const [quality, setQuality] = useState<Quality>("sd");
  const [isSourceLoading, setIsSourceLoading] = useState(false);

  useEffect(() => {
    if (!sources) return;
    setQuality(isHdAvailable ? "hd" : "sd");
  }, [sources, isHdAvailable]);

  const currentSrc = useMemo(
    () => sources?.[quality] ?? "",
    [quality, sources],
  );

  // prevent race conditions when switching fast
  const switchingRef = useRef(false);

  const switchQuality = useCallback(
    (nextQuality: Quality) => {
      const video = videoRef.current;
      if (!video) return;

      const nextSrc = sources?.[nextQuality];
      if (!nextSrc) return;

      // avoid unnecessary switch
      if (nextQuality === quality) return;

      // prevent double switching
      if (switchingRef.current) return;
      switchingRef.current = true;

      setQuality(nextQuality);

      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;

      setIsSourceLoading(true);

      // wait for new source to be ready
      const handleReady = () => {
        video.removeEventListener("loadedmetadata", handleReady);

        // restore playback position
        try {
          video.currentTime = currentTime;
        } catch {}

        if (wasPlaying) {
          video.play().catch(() => {});
        }

        setIsSourceLoading(false);
        switchingRef.current = false;
      };

      video.addEventListener("loadedmetadata", handleReady);
    },
    [videoRef, sources, quality],
  );

  return {
    quality,
    currentSrc,
    switchQuality,
    isSourceLoading,
  };
}
