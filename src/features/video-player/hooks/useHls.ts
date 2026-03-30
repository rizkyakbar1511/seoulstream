"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

type UseHlsOptions = {
  src: {
    url: string;
    isHls?: boolean;
  };
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export const useHls = ({ src, videoRef }: UseHlsOptions) => {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src.url) return;

    const videoSrc = `/api/video/${src.url}`;
    const isNativeHlsSupported = video.canPlayType(
      "application/vnd.apple.mpegurl",
    );

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();

    // 🧠 Safari (native HLS)
    if (isNativeHlsSupported || !src.isHls) {
      video.src = videoSrc;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hlsRef.current = hls;
      hls.loadSource(videoSrc);
      hls.attachMedia(video);

      // optional: debug events
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log("HLS error event:", event);
        console.error("HLS error:", data);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    console.warn("HLS not supported in this browser");
  }, [videoRef, src.url, src.isHls]);

  return hlsRef;
};
