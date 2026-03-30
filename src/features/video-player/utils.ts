import { jwtVerify, SignJWT } from "jose";

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

function getVideoTokenSecret() {
  const secret = process.env.VIDEO_URL_SECRET;

  if (!secret) {
    throw new Error("VIDEO_SECRET missing");
  }

  return new TextEncoder().encode(secret);
}

export function createVideoToken(url: string) {
  return new SignJWT({ url })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")
    .sign(getVideoTokenSecret());
}

export async function verifyVideoToken(token: string) {
  const { payload } = await jwtVerify(token, getVideoTokenSecret());
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
