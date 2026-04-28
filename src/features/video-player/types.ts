import type { Episode, VideoSource } from "../drama/types";

export type VideoPlayerProps = {
  src?: VideoSource;
  isHdAvailable: boolean;
  title?: string;
  poster?: string;
  className?: string;
  prevEpisode: Episode | null;
  nextEpisode: Episode | null;
};
export type Quality = "sd" | "hd";
