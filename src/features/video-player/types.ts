import type { Episode, VideoSource } from "../drama/types";

export type VideoPlayerProps = Pick<
	Episode,
	"id" | "category_id" | "title" | "poster" | "isHdAvailable"
> & {
	video?: VideoSource;
	className?: string;
	prevEpisode: Episode | null;
	nextEpisode: Episode | null;
	totalEpisodes: number;
};

export enum Quality {
	SD = "sd",
	HD = "hd",
}

export type ContinueWatch = Pick<
	Episode,
	"id" | "category_id" | "title" | "poster"
> & {
	position: number;
	duration: number;
	updatedAt: number;
	totalEpisodes: number;
};
