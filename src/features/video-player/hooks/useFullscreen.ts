"use client";

import { useCallback, useEffect, useState } from "react";

interface WebkitElement extends HTMLElement {
  webkitRequestFullscreen: () => void;
}

interface WebkitVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen: () => void;
}

interface WebkitDocument extends Document {
  webkitExitFullscreen: () => void;
}

type UseFullscreenParams = {
  containerRef: React.RefObject<HTMLElement | null>;
  videoRef?: React.RefObject<HTMLVideoElement | null>; // for iOS fallback
};

export function useFullscreen({ containerRef, videoRef }: UseFullscreenParams) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  const enterFullscreen = useCallback(() => {
    const el = containerRef.current;
    const video = videoRef?.current;

    if (!el) return;

    // Standard
    if ("requestFullscreen" in el) {
      el.requestFullscreen();
      return;
    }

    // Safari
    if ("webkitRequestFullscreen" in el) {
      (el as WebkitElement).webkitRequestFullscreen();
      return;
    }

    // iOS fallback (VERY IMPORTANT)
    if (video && "webkitEnterFullscreen" in el) {
      (video as WebkitVideoElement).webkitEnterFullscreen();
    }
  }, [containerRef, videoRef]);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      return;
    }

    if ((document as WebkitDocument).webkitExitFullscreen) {
      (document as WebkitDocument).webkitExitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
