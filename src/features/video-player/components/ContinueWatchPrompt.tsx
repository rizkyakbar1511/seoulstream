"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatVideoTime } from "../utils";

type ContinueWatchingPromptProps = {
  open: boolean;
  position?: number;
  onContinue: () => void;
  onRestart: () => void;
};

export function ContinueWatchingPrompt({
  open,
  position,
  onContinue,
  onRestart,
}: ContinueWatchingPromptProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Continue watching?</AlertDialogTitle>

          <AlertDialogDescription>
            You stopped watching at {formatVideoTime(position ?? 0)}. Would you
            like to continue from there?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onRestart}>Start over</AlertDialogCancel>

          <AlertDialogAction onClick={onContinue}>
            Continue watching
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
