"use client";

import { Slider } from "@/components/ui/slider";

type SeekbarProps = {
  progress: number;
  buffered: number;
  onChange: (value: number) => void;
  onInteractStart: () => void;
  onInteractEnd: () => void;
};

export function Seekbar({
  progress,
  buffered,
  onChange,
  onInteractStart,
  onInteractEnd,
}: SeekbarProps) {
  return (
    <Slider
      className="relative z-10"
      value={[progress]}
      bufferedPercent={buffered}
      onValueChange={(value) => onChange(value[0])}
      max={100}
      step={0.1}
      onPointerDown={onInteractStart}
      onPointerUp={onInteractEnd}
    />
  );
}
