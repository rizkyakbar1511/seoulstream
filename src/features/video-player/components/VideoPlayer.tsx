"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatVideoTime } from "../utils";
import type { VideoPlayerProps } from "../types";
import { PlayerControls } from "./PlayerControls";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { useHls } from "../hooks/useHls";
import { useBuffering } from "../hooks/useBuffering";
import {
  Loader2,
  MinusIcon,
  PlusIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { FeedbackOverlay } from "./FeedbackOverlay";
import { useTransientState } from "../hooks/useTransientState";
import { useFullscreen } from "../hooks/useFullscreen";
import { useAutoHideControls } from "../hooks/useAutoHideControls";
import { useVideoSource } from "../hooks/useVideoSource";
import { useDoubleTapSeek } from "../hooks/useDoubleTapSeek";

export function VideoPlayer({
  src,
  title = "Untitled",
  isHdAvailable,
  poster,
  className,
  prevEpisode,
  nextEpisode,
}: VideoPlayerProps) {
  const [seekDelta, setSeekDelta] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSeekDelta = (delta: number, moved: number) =>
    setSeekDelta((prev) => {
      if (prev === null) return delta;
      const sameDirection = (prev > 0 && delta > 0) || (prev < 0 && delta < 0);
      if (moved === 0 || !sameDirection) return delta;
      return prev + delta;
    });

  const { switchQuality, currentSrc, quality, isSourceLoading } =
    useVideoSource({
      videoRef,
      sources: src,
      isHdAvailable,
    });

  useHls({
    videoRef,
    src: {
      url: currentSrc,
      isHls: src?.isHls,
    },
  });

  const { isFullscreen, toggleFullscreen } = useFullscreen({
    containerRef,
    videoRef,
  });
  const { state, actions } = useVideoPlayer(videoRef, toggleFullscreen);
  const { handleDoubleTap } = useDoubleTapSeek({
    containerRef,
    onSeek: (delta) => {
      const moved = actions.seekBy(delta);
      handleSeekDelta(delta, moved);
    },
  });
  const {
    visible: controlsVisible,
    showControls,
    hideControls,
    startInteracting,
    stopInteracting,
  } = useAutoHideControls({
    isPlaying: state.isPlaying,
  });
  const isBuffering = useBuffering(videoRef);
  const showBuffer = isBuffering || state.isSeeking || isSourceLoading;

  // UI feedback based on user interaction
  const volumeFeedback = useTransientState({
    value: state.volume[0],
  });
  const VolumeFeedbackIcon = state.isMuted
    ? VolumeXIcon
    : state.volume[0] < 50
      ? Volume1Icon
      : Volume2Icon;

  const seekFeedback = useTransientState({
    value: seekDelta,
  });

  useEffect(() => {
    if (seekFeedback === null) {
      setSeekDelta(null);
    }
  }, [seekFeedback]);

  const isMobile =
    typeof window !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleContainerTap = (e: React.PointerEvent) => {
    const target = e.target as HTMLDivElement;

    // ignore controls interaction
    if (target.closest("[data-player-controls]")) return;

    // 📱 Mobile behavior
    if (e.pointerType === "touch") {
      if (controlsVisible) hideControls();
      else showControls();
      return;
    }

    if (e.pointerType === "mouse") {
      if (e.button !== 0) return; // only left click
      // 🖥 Desktop behavior
      actions.togglePlay();
      showControls();
    }
  };

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border bg-background shadow-sm",
        className,
      )}
    >
      <div
        ref={containerRef}
        tabIndex={0}
        onPointerDown={(e) => {
          handleContainerTap(e);
          handleDoubleTap(e);
        }}
        onMouseMove={!isMobile ? showControls : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            const moved = actions.seekBy(5);
            handleSeekDelta(5, moved);
            return;
          }

          if (e.key === "ArrowLeft") {
            e.preventDefault();
            const moved = actions.seekBy(-5);
            handleSeekDelta(-5, moved);
            return;
          }

          actions.handleKeyDown(e); // fallback to core logic
        }}
        onDoubleClick={() => {
          if (isMobile) return;
          toggleFullscreen();
        }}
        className="relative w-full h-[45dvh] sm:h-auto sm:aspect-video bg-black outline-none focus:ring-2 focus:ring-primary touch-manipulation"
      >
        <FeedbackOverlay visible={showBuffer}>
          <Loader2 className="size-10 animate-spin text-white" />
        </FeedbackOverlay>
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 left-16 flex items-center justify-center gap-1 transition-transform scale-0",
            { "scale-100": seekFeedback !== null && seekFeedback < 0 },
          )}
        >
          <MinusIcon className="size-4 sm:size-6" strokeWidth={3} />
          <p className="text-white text-sm sm:text-lg tabular-nums">
            {Math.abs(seekFeedback || 0)}s
          </p>
        </div>
        <FeedbackOverlay visible={volumeFeedback !== null} backdrop={false}>
          <div className="px-3 py-2 bg-neutral-800/40 backdrop-blur rounded flex flex-col items-center justify-center gap-2 size-20 sm:size-40">
            <VolumeFeedbackIcon className="size-4" />
            <p className="text-white text-sm tabular-nums">{volumeFeedback}%</p>
          </div>
        </FeedbackOverlay>
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-16 flex items-center justify-center gap-1 transition-transform scale-0",
            { "scale-100": seekFeedback !== null && seekFeedback > 0 },
          )}
        >
          <PlusIcon className="size-4 sm:size-6" strokeWidth={3} />
          <p className="text-white text-sm  sm:text-lg tabular-nums">
            {Math.abs(seekFeedback || 0)}s
          </p>
        </div>
        <video
          ref={videoRef}
          className={"size-full object-contain"}
          poster={poster}
          controls={false}
          playsInline
          webkit-playsinline="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-800/80 via-neutral-800/10 transition-opacity to-transparent opacity-0",
            {
              "opacity-100": controlsVisible,
            },
          )}
        >
          <h3 className="truncate uppercase font-bold text-xs xs:text-base absolute top-10 left-10">
            {title}
          </h3>
        </div>
        <div
          data-player-controls
          className={cn(
            "absolute inset-x-0 bottom-0 translate-y-full xs:p-4 transition-transform duration-300 pointer-events-auto",
            {
              "translate-y-0": controlsVisible,
            },
          )}
        >
          <PlayerControls
            portalContainer={containerRef.current ?? undefined}
            prevEpisode={prevEpisode}
            nextEpisode={nextEpisode}
            quality={quality}
            isPlaying={state.isPlaying}
            isHdAvailable={isHdAvailable}
            isFullscreen={isFullscreen}
            isMuted={state.isMuted}
            currentTimeLabel={formatVideoTime(
              (state.progress / 100) * state.duration,
            )}
            durationLabel={formatVideoTime(state.duration)}
            progress={state.progress}
            buffered={state.buffered}
            volume={state.volume}
            onPlayToggle={actions.togglePlay}
            onSeekChange={actions.handleSeek}
            onVolumeChange={actions.handleVolume}
            onMuteToggle={actions.toggleMute}
            onFullscreenToggle={toggleFullscreen}
            onQualityChange={switchQuality}
            onInteractStart={startInteracting}
            onInteractEnd={stopInteracting}
          />
        </div>
      </div>
    </section>
  );
}
