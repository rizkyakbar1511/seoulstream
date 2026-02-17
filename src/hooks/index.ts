import { useCallback, useEffect, useRef, useState } from "react";
import { isHlsSource } from "@/lib/utils";
import type { UseVideoPlayerProps } from "@/types";
import Hls from "hls.js";

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useVideoPlayer({ src, isHdAvailable }: UseVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const bufferedRafRef = useRef<number | null>(null);

  const [quality, setQuality] = useState(isHdAvailable ? "HD" : "SD");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQualitySwitching, setIsQualitySwitching] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // Seek time preview states
  const [previewTime, setPreviewTime] = useState(0);
  const [previewPosition, setPreviewPosition] = useState({ x: 0 });

  const handlePreviewTime = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const percent = (clientX - rect.left) / rect.width;
      const time = percent * duration;

      const x = clientX - rect.left;

      setPreviewTime(time);
      setPreviewPosition({ x });
    },
    [duration],
  );

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  }, []);

  const handleSeek = useCallback((newTime: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleQualityChange = useCallback(
    (newQuality: string) => {
      if (!videoRef.current || quality === newQuality) return;

      const wasPlaying = !videoRef.current.paused;
      const savedTime = videoRef.current.currentTime;

      setIsQualitySwitching(true);
      setQuality(newQuality); // This triggers the main useEffect to re-run

      // After the new source is loaded by useEffect, restore playback state
      videoRef.current.addEventListener(
        "loadeddata",
        () => {
          if (!videoRef.current) return;
          videoRef.current.currentTime = savedTime;
          if (wasPlaying) {
            videoRef.current.play();
          }
        },
        { once: true },
      );
    },
    [quality],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: channel ID
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;

    console.log("=== Initializing video player ===");

    const videoSource = `/api/video/${src[quality.toLowerCase() as "hd" | "sd"]}`;

    if (hlsRef.current) {
      hlsRef.current.stopLoad();
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (
      video.canPlayType("application/vnd.apple.mpegurl") ||
      !isHlsSource(videoSource)
    ) {
      video.src = videoSource;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoSource);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError(`Playback error: ${data.details}`);
        }
      });
    }

    const onLoadedData = () => {
      setIsLoading(false);
      setIsQualitySwitching(false);
      setError(null);
      console.log("=== Video loaded successfully ===");
    };

    const onError = (e: Event) => {
      setError("Video playback failed");
      setIsLoading(false);
      setIsQualitySwitching(false);
      console.log("Video Error:", e);
    };

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => {
      if (video.duration && Number.isFinite(video.duration))
        setDuration(video.duration);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);

      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(true);
      setIsBuffering(false);
      setIsQualitySwitching(false);
      setBufferedTime(0);
      setShowControls(true);

      if (video) {
        video.pause();

        // Reset video element
        video.currentTime = 0;
        video.src = "";
        video.load(); // This clears the video element completely
      }

      if (hlsRef.current) {
        hlsRef.current.stopLoad();
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src.channelId, quality]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      if (!showControls) {
        setShowControls(true);
      }
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const handleTouchOrMouseMove = () => {
      resetTimeout();
    };
    const handleMouseLeave = () => {
      if (isPlaying) setShowControls(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleTouchOrMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener("mousemove", handleTouchOrMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isPlaying, showControls]);

  // Effect for fullscreen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  // Track buffered progress of the video (HLS + native fallback) — cleaned & optimized
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !quality) return;

    const BUFFERED_THRESHOLD_SECONDS = 0.5;

    const readBufferedEnd = (): number | null => {
      if (!video || video.buffered.length === 0) return null;
      try {
        return video.buffered.end(video.buffered.length - 1);
      } catch {
        return null; // defensive: browser may throw if ranges mutate mid-read
      }
    };

    const updateBufferedMetrics = () => {
      const bufferedEnd = readBufferedEnd();
      if (bufferedEnd == null) return;

      setBufferedTime((prev) => (prev === bufferedEnd ? prev : bufferedEnd));

      // If there's a healthy buffer ahead, mark not-buffering
      const gap = bufferedEnd - video.currentTime;
      setIsBuffering(gap <= BUFFERED_THRESHOLD_SECONDS);
    };

    const rafLoop = () => {
      updateBufferedMetrics();
      // keep looping while loading or playing
      if (!video.paused || video.readyState < 4) {
        bufferedRafRef.current = requestAnimationFrame(rafLoop);
      } else {
        bufferedRafRef.current = null;
      }
    };

    const startTracking = () => {
      if (bufferedRafRef.current) cancelAnimationFrame(bufferedRafRef.current);
      setIsBuffering(true);
      rafLoop();
    };

    const stopTracking = () => {
      if (bufferedRafRef.current) {
        cancelAnimationFrame(bufferedRafRef.current);
        bufferedRafRef.current = null;
      }
      setIsBuffering(false);
    };

    // events (use named functions so they can be removed)
    const onProgress = startTracking;
    const onWaiting = startTracking;
    const onStalled = startTracking;
    const onSeeking = startTracking;
    const onPlaying = stopTracking;
    const onCanPlayThrough = stopTracking;
    const onLoadedMetadata = updateBufferedMetrics;
    const onLoadStart = startTracking;

    // Kick off initial tracking if the video is still loading/playing
    if (!video.paused || video.readyState < 4) startTracking();
    else updateBufferedMetrics(); // ensure initial buffered value is set

    // HLS branch if present
    const hls = hlsRef.current;
    if (hls) {
      const onFragLoading = startTracking;
      const onBufferAppending = startTracking;
      const onBufferEos = stopTracking;
      const onBufferFlushed = () => {
        setBufferedTime(0);
        setIsBuffering(true);
        startTracking();
      };

      hls.on(Hls.Events.FRAG_LOADING, onFragLoading);
      hls.on(Hls.Events.BUFFER_APPENDING, onBufferAppending);
      hls.on(Hls.Events.BUFFER_EOS, onBufferEos);
      hls.on(Hls.Events.BUFFER_FLUSHED, onBufferFlushed);

      video.addEventListener("loadstart", onLoadStart);
      video.addEventListener("canplaythrough", onCanPlayThrough);

      return () => {
        // stop RAF
        stopTracking();

        hls.off(Hls.Events.FRAG_LOADING, onFragLoading);
        hls.off(Hls.Events.BUFFER_APPENDING, onBufferAppending);
        hls.off(Hls.Events.BUFFER_EOS, onBufferEos);
        hls.off(Hls.Events.BUFFER_FLUSHED, onBufferFlushed);

        video.removeEventListener("loadstart", onLoadStart);
        video.removeEventListener("canplaythrough", onCanPlayThrough);
      };
    } else {
      // Native fallback
      video.addEventListener("progress", onProgress);
      video.addEventListener("waiting", onWaiting);
      video.addEventListener("stalled", onStalled);
      video.addEventListener("seeking", onSeeking);

      video.addEventListener("playing", onPlaying);
      video.addEventListener("canplaythrough", onCanPlayThrough);
      video.addEventListener("loadedmetadata", onLoadedMetadata);

      return () => {
        // stop RAF
        stopTracking();
        video.removeEventListener("progress", onProgress);
        video.removeEventListener("waiting", onWaiting);
        video.removeEventListener("stalled", onStalled);
        video.removeEventListener("seeking", onSeeking);

        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("canplaythrough", onCanPlayThrough);
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    }
    // keep deps empty to match original behavior; consider adding videoRef and hlsRef if they can change
  }, [quality]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.metaKey) {
        e.preventDefault();

        switch (e.key.toLowerCase()) {
          case " ":
          case "k":
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play();
              } else {
                videoRef.current.pause();
              }
            }
            break;
          case "m":
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
            }
            break;
          case "arrowright":
          case "l":
            if (videoRef.current) {
              videoRef.current.currentTime += 10; // skip forward
            }
            break;
          case "arrowleft":
          case "j":
            if (videoRef.current) {
              videoRef.current.currentTime -= 10; // skip backward
            }
            break;
          case "arrowup":
            if (videoRef.current) {
              videoRef.current.volume = Math.min(
                videoRef.current.volume + 0.1,
                1,
              );
            }
            break;
          case "arrowdown":
            if (videoRef.current) {
              videoRef.current.volume = Math.max(
                videoRef.current.volume - 0.1,
                0,
              );
            }
            break;
          case "f":
            toggleFullscreen();
            break;
          case "escape":
            if (document.fullscreenElement) {
              document.exitFullscreen?.();
            }
            break;
        }
      }
    };

    container.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [toggleFullscreen]);

  const retryPlayback = () => {
    setError(null);
    setIsLoading(true);
    setIsBuffering(false);

    // Force re-initialization by triggering the main useEffect
    // This will re-run the video setup logic

    // Alternative approach: Manually re-initialize
    const video = videoRef.current;
    if (!video) return;

    // Clean up existing HLS if present
    if (hlsRef.current) {
      hlsRef.current.stopLoad();
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Reset video element
    video.pause();
    video.currentTime = 0;
    video.src = "";

    // Trigger re-initialization by updating quality state
    // This will cause the main useEffect to run again
    setQuality((prev) => prev); // This forces the useEffect to re-run
  };

  return {
    containerRef,
    videoRef,
    quality,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    showControls,
    isLoading,
    error,
    isQualitySwitching,
    isFullScreen,
    bufferedTime,
    isBuffering,
    previewTime,
    previewPosition,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    toggleFullscreen,
    handleQualityChange,
    retryPlayback,
    handlePreviewTime,
  };
}
