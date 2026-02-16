"use client";

import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CategoryPostResponse } from "@/types";
import { formatVideoTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useVideoPlayer } from "@/hooks";
interface VideoPlayerProps {
  src: {
    channelId: number;
    hd: string;
    sd: string;
  };
  isHdAvailable: boolean;
  poster: string;
  prevEpisode: CategoryPostResponse["posts"][number] | null;
  nextEpisode: CategoryPostResponse["posts"][number] | null;
}

export default function VideoPlayer({
  src,
  isHdAvailable,
  poster,
  prevEpisode,
  nextEpisode,
}: VideoPlayerProps) {
  const {
    containerRef,
    videoRef,
    quality,
    isPlaying,
    isMuted,
    isBuffering,
    isLoading,
    volume,
    currentTime,
    duration,
    showControls,
    error,
    isQualitySwitching,
    isFullScreen,
    bufferedTime,
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
  } = useVideoPlayer({ src, isHdAvailable });

  const router = useRouter();
  const availableVideoQualities = Object.entries({
    HD: src.hd,
    SD: src.sd,
  })
    .filter(([_, url]) => Boolean(url))
    .map(([label]) => label);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-lg min-h-80 overflow-hidden bg-black"
    >
      <div
        className={cn(
          "absolute pointer-events-none inset-0 duration-300 transform-opacity bg-primary/15 grid place-items-center",
          isLoading || isPlaying ? "opacity-0" : "opacity-100",
        )}
      >
        <Play className="size-16 fill-primary" />
      </div>
      {/** biome-ignore lint/a11y/useMediaCaption: ignore track captions */}
      <video
        className="size-full"
        ref={videoRef}
        poster={poster}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
      />

      {(isLoading || isQualitySwitching || isBuffering) && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <Loader2 className="size-12 mx-auto animate-spin mb-4" />
            <p className="text-sm">
              {isQualitySwitching
                ? "Switching quality..."
                : isBuffering
                  ? `Buffering...`
                  : "Loading video..."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white max-w-md px-4">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold mb-2">Video Status</h3>
            <p className="text-sm mb-4 opacity-90">{error}</p>
            <Button
              onClick={retryPlayback}
              className="bg-primary hover:bg-primary/90"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/** video controls */}
      <div
        data-control
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 z-20",
          showControls ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mb-4 relative">
          <Slider
            className="appearance-none peer/seek"
            min={0}
            max={duration || 0}
            value={[currentTime]}
            onValueChange={handleSeek}
            buffered={bufferedTime}
            onMouseMove={handlePreviewTime}
            onTouchMove={handlePreviewTime}
          />
          <div
            className="absolute bg-primary w-max rounded-sm text-white p-1 text-sm -top-10 translate-y-full opacity-0 pointer-events-none peer-hover/seek:opacity-100 peer-hover/seek:translate-y-0 origin-center transition-[opacity_transform] duration-200 ease-in-out -z-10
                after:absolute after:size-1.5 after:left-1/2 after:-translate-x-1/2 after:top-full after:-translate-y-1/2 after:rotate-45 after:bg-primary
                "
            style={{
              left: `${previewPosition.x}px`,
              transform: "translateX(-50%)",
            }}
          >
            {previewTime && formatVideoTime(previewTime)}
          </div>
          <div className="flex justify-between text-xs text-white/80 mt-2">
            <span>{formatVideoTime(currentTime)}</span>
            <span>{formatVideoTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-4">
            <Button
              disabled={!prevEpisode}
              className="text-white hover:bg-white/20 disabled:opacity-50"
              size="sm"
              variant="ghost"
              onClick={() =>
                router.push(`?channel_id=${prevEpisode?.channel_id}`)
              }
            >
              <ChevronLeft className="size-3 sm:size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
              variant="ghost"
              size="sm"
            >
              {isPlaying ? (
                <Pause className="size-4 sm:size-5" />
              ) : (
                <Play className="size-4 sm:size-5" />
              )}
            </Button>
            <Button
              disabled={!nextEpisode}
              className="text-white hover:bg-white/20 disabled:opacity-50"
              size="sm"
              variant="ghost"
              onClick={() =>
                router.push(`?channel_id=${nextEpisode?.channel_id}`)
              }
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-3 sm:size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                className="text-white hover:bg-white-20"
                variant="ghost"
                size="sm"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </Button>
              <Slider
                className="w-14 sm:w-24"
                min={0}
                max={1}
                step={0.1}
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="text-white hover:bg-white/20 text-xs sm:text-sm"
                  variant={quality === "HD" ? "default" : "ghost"}
                  size="sm"
                >
                  {quality}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Video Quality</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={quality}
                  onValueChange={handleQualityChange}
                >
                  {availableVideoQualities.map((quality) => (
                    <DropdownMenuRadioItem key={quality} value={quality}>
                      {quality}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 text-sm"
              variant="ghost"
              size="icon"
            >
              {isFullScreen ? (
                <Minimize2 className="size04" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
