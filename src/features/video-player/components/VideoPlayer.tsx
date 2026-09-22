"use client";

import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  Poster,
  Menu,
  ChapterTitle,
} from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

import { type ContinueWatch, type VideoPlayerProps, Quality } from "../types";
import { useRef, useState } from "react";
import { useContinueWatching } from "../hooks/useContinueWatching";
import { ContinueWatchingPrompt } from "./ContinueWatchPrompt";
import { getVideoMimeType } from "../utils";
import { CheckIcon } from "lucide-react";

export default function VideoPlayer({
  id,
  category_id,
  poster,
  video,
  title,
  isHdAvailable,
  totalEpisodes,
}: VideoPlayerProps) {
  const [quality, setQuality] = useState<Quality>(() =>
    isHdAvailable ? Quality.HD : Quality.SD,
  );
  const [error, setError] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<ContinueWatch | null>(null);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const hasCheckedResume = useRef(false);
  const qualitySwitchRef = useRef<{
    time: number;
    playing: boolean;
  } | null>(null);
  const currentSrc = video?.[quality];

  const { save, getResumePosition, complete } = useContinueWatching({
    id,
    category_id,
    totalEpisodes,
    title,
    poster,
  });
  const [initialResume] = useState(() => getResumePosition());

  const switchQuality = (nextQuality: Quality) => {
    if (nextQuality === quality) return;

    const player = playerRef.current;

    if (player) {
      qualitySwitchRef.current = {
        time: player.currentTime,
        playing: !player.paused,
      };
    }

    setQuality(nextQuality);
  };

  const onPlay = () => {
    if (hasCheckedResume.current) return;
    hasCheckedResume.current = true;

    const player = playerRef.current;
    const saved = initialResume;

    if (!player || !saved) return;
    if (saved.position < 30) return;

    if (saved.duration > 0 && saved.position / saved.duration >= 0.95) return;

    player.pause();
    setResumePrompt(saved);
  };

  const onCanPlay = async () => {
    const resume = qualitySwitchRef.current;
    const player = playerRef.current;

    if (!player || !resume) return;

    player.currentTime = resume.time;
    qualitySwitchRef.current = null;

    if (resume.playing) {
      try {
        await player.play();
      } catch (error) {
        console.error("Failed to resume video:", error);
      }
    }
  };

  const onTimeUpdate = () => {
    if (!playerRef.current) return;
    save(playerRef.current.currentTime, playerRef.current.duration);
  };

  //Continue prompt
  const onContinue = () => {
    const player = playerRef.current;
    if (!resumePrompt || !player) return;

    player.currentTime = resumePrompt.position;
    setResumePrompt(null);
    player.play();
  };

  const onRestart = () => {
    const player = playerRef.current;
    if (!player) return;
    complete();
    player.currentTime = 0;
    setResumePrompt(null);
    player.play();
  };

  if (error)
    return (
      <div className="aspect-video bg-black rounded-2xl">
        "implement error UI handling later"
      </div>
    );

  return (
    <>
      <ContinueWatchingPrompt
        open={resumePrompt !== null}
        onContinue={onContinue}
        onRestart={onRestart}
        position={resumePrompt?.position}
      />
      <MediaPlayer
        volume={0.5}
        aspectRatio="16/9"
        ref={playerRef}
        title={title}
        src={{
          src: `/api/video/${currentSrc}`,
          type: getVideoMimeType(video?.isHls ?? false),
        }}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
        onPlay={onPlay}
        onError={(detail) => {
          console.log(detail);
          setError(true);
        }}
      >
        <MediaProvider>
          <Poster className="vds-poster" src={poster} alt={title} />
        </MediaProvider>
        <ChapterTitle className="media-chapter-title" defaultText="test" />
        <PlyrLayout
          thumbnails={poster}
          icons={plyrLayoutIcons}
          slots={{
            settingsMenu: (
              <Menu.Root>
                <Menu.Button>Quality</Menu.Button>
                <Menu.Content>
                  <Menu.RadioGroup value={quality}>
                    <Menu.Radio
                      className="flex items-center gap-2"
                      value={Quality.SD}
                      onSelect={() => switchQuality(Quality.SD)}
                    >
                      SD
                      {quality === Quality.SD && (
                        <CheckIcon className="size-4" />
                      )}
                    </Menu.Radio>
                    {isHdAvailable && (
                      <Menu.Radio
                        className="flex items-center gap-2"
                        value={Quality.HD}
                        onSelect={() => switchQuality(Quality.HD)}
                      >
                        HD
                        {quality === Quality.HD && (
                          <CheckIcon className="size-4" />
                        )}
                      </Menu.Radio>
                    )}
                  </Menu.RadioGroup>
                </Menu.Content>
              </Menu.Root>
            ),
          }}
        />
      </MediaPlayer>
    </>
  );
}
