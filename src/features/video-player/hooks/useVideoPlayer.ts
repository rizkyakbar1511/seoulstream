"use client";

import { useEffect, useRef, useState } from "react";

export function useVideoPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onToggleFullscreen?: () => void,
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);

  const rafRef = useRef<number | null>(null);
  const lastUpdate = useRef(0);
  const lastVolumeRef = useRef(50);

  // 🎯 PLAY / PAUSE SYNC
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  // 🎯 METADATA (duration)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => setDuration(video.duration || 0);

    video.addEventListener("loadedmetadata", onLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [videoRef]);

  // 🎯 BUFFERED (gray bar)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateBuffered = () => {
      if (!video.duration) return;

      try {
        const ranges = video.buffered;
        if (ranges.length > 0) {
          const end = ranges.end(ranges.length - 1);
          setBuffered((end / video.duration) * 100);
        }
      } catch {
        console.error("Failed to update buffered time");
      }
    };

    video.addEventListener("progress", updateBuffered);

    return () => {
      video.removeEventListener("progress", updateBuffered);
    };
  }, [videoRef]);

  // 🎯 rAF LOOP (ONLY WHEN PLAYING)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loop = (time: number) => {
      const v = videoRef.current;
      if (!v) return;

      if (time - lastUpdate.current > 120) {
        const pct = v.duration ? (v.currentTime / v.duration) * 100 : 0;

        setProgress(pct);
        lastUpdate.current = time;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null; // ✅ reset
      }
    };

    video.addEventListener("play", start);
    video.addEventListener("pause", stop);
    video.addEventListener("ended", stop);

    return () => {
      stop();
      video.removeEventListener("play", start);
      video.removeEventListener("pause", stop);
      video.removeEventListener("ended", stop);
    };
  }, [videoRef]);

  // 🎯 detect user intent video seek to show loader
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeking = () => setIsSeeking(true);
    const onSeeked = () => setIsSeeking(false);

    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [videoRef]);

  // 🎯 init volume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 0.5;

    setVolume([50]);
    lastVolumeRef.current = 50;
  }, [videoRef]);

  // 🎯 ACTIONS (UI → video)
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.paused ? video.play() : video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      video.volume = lastVolumeRef.current / 100;
      setVolume([lastVolumeRef.current]);
      setIsMuted(false);
    } else {
      lastVolumeRef.current = Math.round(video.volume * 100);
      video.muted = true;
      setVolume([0]);
      setIsMuted(true);
    }
  };

  // 🔎 Seek handler for slider
  const handleSeek = (pct: number) => {
    const video = videoRef.current;
    if (!video?.duration) return;

    // setIsSeeking(true);
    video.currentTime = (pct / 100) * video.duration;
    setProgress(pct); // immediate UI feedback
  };

  // 🔎 Seek handler for double tap or keyboard action
  const seekBy = (delta: number) => {
    const video = videoRef.current;
    if (!video?.duration) return 0;

    const prevTime = video.currentTime;
    const nextTime = Math.max(0, Math.min(prevTime + delta, video.duration));

    video.currentTime = nextTime;
    setProgress((video.currentTime / video.duration) * 100);
    return nextTime - prevTime;
  };

  const handleVolume = (val: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const volume = val[0] / 100;
    video.volume = volume;
    video.muted = volume === 0;
    lastVolumeRef.current = val[0];
    setVolume(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const video = videoRef.current;
    if (!video) return;

    // const target = e.target as HTMLElement;

    // // ✅ Ignore slider interactions
    // if (target.getAttribute("role") === "slider") return;

    switch (e.key) {
      case " ":
        e.preventDefault();
        video.paused ? video.play() : video.pause();
        break;

      case "ArrowUp": {
        e.preventDefault();
        video.volume = Math.min(video.volume + 0.1, 1);
        video.muted = false;
        const volUp = Math.round(video.volume * 100);
        lastVolumeRef.current = volUp;
        setVolume([volUp]);
        setIsMuted(false);
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        video.volume = Math.max(video.volume - 0.1, 0);
        video.muted = video.volume === 0;

        const volDown = Math.round(video.volume * 100);
        lastVolumeRef.current = volDown;
        setVolume([volDown]);
        setIsMuted(video.muted);
        break;
      }

      case "f":
      case "F":
        e.preventDefault();
        onToggleFullscreen?.();
        break;
    }
  };

  return {
    state: {
      isPlaying,
      isSeeking,
      isMuted,
      progress,
      buffered,
      duration,
      volume,
    },
    actions: {
      togglePlay,
      toggleMute,
      handleSeek,
      seekBy,
      handleVolume,
      handleKeyDown,
    },
  };
}
