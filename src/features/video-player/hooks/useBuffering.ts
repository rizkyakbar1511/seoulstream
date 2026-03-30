"use client";

import { useEffect, useRef, useState } from "react";

export function useBuffering(
  videoRef: React.RefObject<HTMLVideoElement | null>,
) {
  const [isBuffering, setIsBuffering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startBuffering = () => {
      timeoutRef.current = setTimeout(() => {
        setIsBuffering(true);
      }, 150); // debounce
    };

    const stopBuffering = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsBuffering(false);
    };

    //note: video ran out of buffer
    video.addEventListener("waiting", startBuffering);
    //note: network issue
    video.addEventListener("stalled", startBuffering);
    //note: resumed playback
    video.addEventListener("playing", stopBuffering);
    //note: enough data to start
    video.addEventListener("canplay", stopBuffering);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      video.removeEventListener("waiting", startBuffering);
      video.removeEventListener("stalled", startBuffering);
      video.removeEventListener("playing", stopBuffering);
      video.removeEventListener("canplay", stopBuffering);
    };
  }, [videoRef]);

  return isBuffering;
}
