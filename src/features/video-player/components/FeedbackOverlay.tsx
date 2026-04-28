"use client";

import { cn } from "@/lib/utils";

type FeedbackOverlayProps = {
  className?: string;
  visible: boolean;
  children?: React.ReactNode;
  backdrop?: boolean;
};

export function FeedbackOverlay({
  className,
  visible,
  children,
  backdrop = true,
}: FeedbackOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 opacity-0 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none",
        backdrop && "bg-neutral-800/40 backdrop-blur",
        visible && "opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
