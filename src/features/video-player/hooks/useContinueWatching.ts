"use client";

import { useCallback, useRef } from "react";
import {
	getContinueWatching,
	removeContinueWatching,
	saveContinueWatching,
} from "@/features/video-player/utils";
import type { VideoPlayerProps } from "../types";

type Params = Pick<
	VideoPlayerProps,
	"id" | "category_id" | "title" | "poster" | "totalEpisodes"
>;

export const useContinueWatching = ({
	id,
	category_id,
	title,
	poster,
	totalEpisodes,
}: Params) => {
	const lastSavedAt = useRef(0);

	const save = useCallback(
		(position: number, duration: number) => {
			const now = Date.now();

			if (now - lastSavedAt.current < 5000) {
				return;
			}

			lastSavedAt.current = now;

			if (!Number.isFinite(duration) || duration <= 0) {
				return;
			}

			const progress = position / duration;

			// Consider the episode complete at 95%.
			if (progress >= 0.95) {
				removeContinueWatching(category_id);
				return;
			}

			saveContinueWatching({
				title,
				poster,
				id,
				category_id,
				position,
				duration,
				updatedAt: now,
				totalEpisodes,
			});
		},
		[id, category_id],
	);

	const getResumePosition = useCallback(() => {
		return getContinueWatching(category_id);
	}, [category_id]);

	const complete = useCallback(() => {
		removeContinueWatching(category_id);
	}, [category_id]);

	return { save, getResumePosition, complete };
};
