import type Hls from "hls.js";
import type { RefObject } from "react";

export interface UseVideoPlayerProps {
  src: string;
  autoPlay?: boolean;
}

export interface VideoCoreRefs {
  videoRef: RefObject<HTMLVideoElement>;
  containerRef: RefObject<HTMLDivElement>;
  hlsRef: RefObject<Hls | null>;
}
