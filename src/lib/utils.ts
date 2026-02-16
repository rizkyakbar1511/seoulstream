import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	differenceInMinutes,
	differenceInHours,
	differenceInDays,
	differenceInMonths,
	differenceInYears,
} from "date-fns";
import type { CategoryPostResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatViews(views: number) {
	if (views >= 1000000) {
		return `${(views / 1000000).toFixed(1)}M`;
	} else if (views >= 1000) {
		return `${(views / 1000).toFixed(1)}K`;
	}
	return views.toString();
}

export const getTimestampCaption = (releaseTime: string) => {
	const now = new Date();
	const release = new Date(releaseTime);

	const diffInMinutes = differenceInMinutes(now, release);
	if (diffInMinutes < 1) {
		return "Released: just now";
	}
	if (diffInMinutes < 60) {
		return `Released: ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
	}

	const diffInHours = differenceInHours(now, release);
	if (diffInHours < 24) {
		return `Released: ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
	}

	const diffInDays = differenceInDays(now, release);
	if (diffInDays < 30) {
		return `Released: ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
	}

	const diffInMonths = differenceInMonths(now, release);
	if (diffInMonths < 12) {
		return `Released: ${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
	}

	const diffInYears = differenceInYears(now, release);
	return `Released: ${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

export const formatVideoTime = (time: number) => {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);

	if (hours > 0)
		return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const isHlsSource = (url: string) =>
	!!url &&
	(url.includes(".m3u8") ||
		url.startsWith("hls:") ||
		url.includes("application/x-mpegURL"));

export const getPrevNextEpisode = (
	posts: CategoryPostResponse["posts"],
	currentChannelId: number,
) => {
	const index = posts.findIndex((post) => post.channel_id === currentChannelId);

	if (index === -1) return { prev: null, next: null };

	const prev = index > 0 ? posts[index - 1] : null;
	const next = index < posts.length - 1 ? posts[index + 1] : null;

	return {
		prev,
		next,
	};
};

export const isChannelIdMatch = (
	channel_id: number | undefined,
	post_channel_id: number,
	index: number,
) => {
	return channel_id ? Number(channel_id) === post_channel_id : index === 0;
};

export const toBase64 = (str: string) =>
	typeof window === "undefined"
		? Buffer.from(str).toString("base64")
		: window.btoa(str);

export const buildParams = <T extends object>(request: T) => {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(request)) {
		if (value !== undefined && value !== null) {
			params.append(key, String(value));
		}
	}

	return params;
};

export const extractEpisodeNumber = (name: string) => {
	const match = name.match(/E(\d+)/i);
	return match ? parseInt(match[1], 10) : null;
};

export const getEpisodeSortOrder = (
	firstEpisodeNumber: number,
	totalEpisodes: number,
): "asc" | "desc" | null => {
	if (firstEpisodeNumber === null) return null;

	// If first episode equals total → descending (E38, E37, ...)
	if (firstEpisodeNumber === totalEpisodes) return "desc";

	// If first episode is 1 → ascending (E1, E2, ...)
	if (firstEpisodeNumber === 1) return "asc";

	// Fallback: assume descending if first > 1
	return firstEpisodeNumber > 1 ? "desc" : "asc";
};

export const getPageNumber = (
	episodeNumber: number,
	totalEpisodes: number,
	pageSize: number,
	sortOrder: "asc" | "desc" | null,
): number => {
	if (sortOrder === "asc") {
		// E1 = index 0, E2 = index 1...
		const index = episodeNumber - 1;
		return Math.floor(index / pageSize) + 1;
	} else {
		// E36 = index 0, E35 = index 1...
		const index = totalEpisodes - episodeNumber;
		return Math.floor(index / pageSize) + 1;
	}
};
