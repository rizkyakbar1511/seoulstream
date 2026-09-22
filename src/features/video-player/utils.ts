import { EncryptJWT, jwtDecrypt } from "jose";
import { CONTINUE_WATCH } from "./constants";
import type { ContinueWatch } from "./types";

export function getVideoMimeType(isHls: boolean) {
	return isHls ? "application/x-mpegurl" : "video/mp4";
}

export function formatVideoTime(seconds: number) {
	if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

	const total = Math.floor(seconds);
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;

	const mm = String(m).padStart(2, "0");
	const ss = String(s).padStart(2, "0");

	return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export const isHlsStreamUrl = (url: string) => /\.m3u8(\?|$)/i.test(url);
export const isChannelIdMatch = (
	channel_id: number | undefined,
	post_channel_id: number,
	index: number,
) => {
	return channel_id ? Number(channel_id) === post_channel_id : index === 0;
};

function getVideoTokenSecret() {
	// A256GCM needs exactly 32 bytes: openssl rand -base64 32
	const secret = process.env.VIDEO_URL_SECRET;
	if (!secret) throw new Error("VIDEO_URL_SECRET missing");
	return Buffer.from(secret, "base64");
}

export function createVideoToken(url: string) {
	return new EncryptJWT({ url })
		.setProtectedHeader({ alg: "dir", enc: "A256GCM" })
		.setExpirationTime("2h")
		.encrypt(getVideoTokenSecret());
}

export async function verifyVideoToken(token: string) {
	const { payload } = await jwtDecrypt(token, getVideoTokenSecret());
	return payload.url as string;
}

export async function replaceURIWithToken(line: string, baseUrl: URL) {
	const matches = [...line.matchAll(/URI="([^"]+)"/g)];

	let newLine = line;

	for (const match of matches) {
		const url = match[1];
		const absoluteUrl = new URL(url, baseUrl).toString();
		const token = await createVideoToken(absoluteUrl);

		newLine = newLine.replace(match[0], `URI="/api/video/${token}"`);
	}

	return newLine;
}

function getAll(): ContinueWatch[] {
	if (typeof window === "undefined") {
		return [];
	}

	const stored = localStorage.getItem(CONTINUE_WATCH);

	if (!stored) {
		return [];
	}

	try {
		return JSON.parse(stored) as ContinueWatch[];
	} catch {
		return [];
	}
}

function saveAll(items: ContinueWatch[]) {
	localStorage.setItem(CONTINUE_WATCH, JSON.stringify(items));
}

export function getContinueWatching(categoryId: number): ContinueWatch | null {
	return getAll().find((item) => item.category_id === categoryId) ?? null;
}

export function getContinueWatchingList(): ContinueWatch[] {
	return [...getAll()].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveContinueWatching(item: ContinueWatch) {
	const items = getAll();

	const index = items.findIndex(
		(existing) => existing.category_id === item.category_id,
	);

	if (index === -1) {
		items.push(item);
	} else {
		items[index] = item;
	}

	saveAll(items);
}

export function removeContinueWatching(categoryId: number) {
	saveAll(getAll().filter((item) => item.category_id !== categoryId));
}
