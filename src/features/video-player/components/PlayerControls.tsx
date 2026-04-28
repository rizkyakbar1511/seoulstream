"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  FastForwardIcon,
  Maximize2Icon,
  Minimize2Icon,
  Pause,
  Play,
  RewindIcon,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Seekbar } from "./Seekbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Quality } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Episode } from "@/features/drama/types";
import Link from "next/link";

type PlayerControlsProps = {
  portalContainer?: HTMLElement;
  prevEpisode: Episode | null;
  nextEpisode: Episode | null;
  quality: Quality;
  isPlaying: boolean;
  isFullscreen: boolean;
  isMuted: boolean;
  isHdAvailable: boolean;
  currentTimeLabel: string;
  durationLabel: string;
  progress: number;
  buffered: number;
  volume: number[];
  onPlayToggle: () => void;
  onSeekChange: (value: number) => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onQualityChange: (value: Quality) => void;
  onInteractStart: () => void;
  onInteractEnd: () => void;
};

export function PlayerControls({
  portalContainer,
  prevEpisode,
  nextEpisode,
  quality,
  isPlaying,
  isFullscreen,
  isMuted,
  isHdAvailable,
  currentTimeLabel,
  durationLabel,
  progress,
  buffered,
  volume,
  onPlayToggle,
  onSeekChange,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onQualityChange,
  onInteractStart,
  onInteractEnd,
}: PlayerControlsProps) {
  const volumeValue = volume[0] ?? 0;
  const VolumeIcon = isMuted ? VolumeX : volumeValue < 50 ? Volume1 : Volume2;
  const FullscreenIcon = isFullscreen ? Minimize2Icon : Maximize2Icon;
  const PlayToggleIcon = isPlaying ? Pause : Play;

  return (
    <div className="space-y-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/80 p-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3 text-sm dark:text-white/90">
        <p className="tabular-nums text-xs xs:text-base">
          {currentTimeLabel} / {durationLabel}
        </p>
      </div>
      <Seekbar
        progress={progress}
        buffered={buffered}
        onChange={onSeekChange}
        onInteractStart={onInteractStart}
        onInteractEnd={onInteractEnd}
      />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0 xs:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={!prevEpisode?.category_id}
                className="shrink-0"
                size="icon"
                variant="ghost"
              >
                <Link
                  href={`/dramas/${prevEpisode?.category_id}?channel_id=${prevEpisode?.id}`}
                >
                  <RewindIcon className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent portalContainer={portalContainer}>
              {prevEpisode?.title}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shrink-0"
                size="icon"
                variant="ghost"
                onClick={onPlayToggle}
              >
                <PlayToggleIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="flex items-center gap-1"
              portalContainer={portalContainer}
            >
              {isPlaying ? "Pause" : "Play"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={!nextEpisode}
                className="shrink-0"
                size="icon"
                variant="ghost"
              >
                <Link
                  href={`/dramas/${nextEpisode?.category_id}?channel_id=${nextEpisode?.id}`}
                >
                  <FastForwardIcon className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent portalContainer={portalContainer}>
              {nextEpisode?.title}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onMuteToggle}
                className="shrink-0"
                size="icon"
                variant="ghost"
              >
                <VolumeIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent portalContainer={portalContainer}>
              {isMuted ? "Unmute" : "Mute"}
            </TooltipContent>
          </Tooltip>
          <Slider
            value={volume}
            max={100}
            step={1}
            onValueChange={onVolumeChange}
            className="w-20 hidden xs:flex"
            onPointerDown={onInteractStart}
            onPointerUp={onInteractEnd}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={quality}
            onValueChange={(v) => {
              onQualityChange(v as Quality);
              onInteractEnd?.(); // close interaction
            }}
            onOpenChange={(open) => {
              if (open) onInteractStart?.();
              else onInteractEnd?.();
            }}
          >
            <SelectTrigger
              onPointerDown={(e) => {
                e.stopPropagation();
                onInteractStart?.();
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              portalContainer={portalContainer ?? undefined}
            >
              <SelectItem value="sd">SD</SelectItem>
              {isHdAvailable && <SelectItem value="hd">HD</SelectItem>}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onFullscreenToggle}
                className="shrink-0"
                size="icon"
                variant="ghost"
              >
                <FullscreenIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fullscreen</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
