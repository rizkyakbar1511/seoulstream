import {
  createVideoToken,
  replaceURIWithToken,
  verifyVideoToken,
} from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/video/[token]">,
) {
  const { token } = await ctx.params;
  const range = req.headers.get("range");

  if (!token) {
    return new Response("Missing token", { status: 403 });
  }

  let videoUrl: string | undefined;

  try {
    videoUrl = await verifyVideoToken(token);
  } catch {
    return new Response("Invalid or expired token", { status: 403 });
  }

  try {
    const { hostname } = new URL(videoUrl);

    const isAllowedProxy = hostname.includes(process.env.PROXY_VIDEO_HOSTNAME);

    const headers: Record<string, string> = {
      "Accept-Encoding": "identity",
      "Accept-Ranges": "bytes",
    };

    if (isAllowedProxy) {
      headers["User-Agent"] = process.env.PROXY_VIDEO_USER_AGENT;
      headers.Authorization = `Basic ${process.env.PROXY_VIDEO_ACCESS_TOKEN}`;
      headers["Icy-MetaData"] = "1";
    }

    if (range) headers.Range = range;

    const upstream = await fetch(videoUrl, { headers });

    if (!upstream.ok && upstream.status !== 206) {
      return new Response("Upstream error", { status: upstream.status });
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";

    if (contentType.includes("mpegurl") || videoUrl.endsWith(".m3u8")) {
      let playlist = await upstream.text();

      const baseUrl = new URL(".", videoUrl);
      const lines = playlist.replace(/\r/g, "").split("\n");

      const processedLines = await Promise.all(
        lines.map(async (line) => {
          if (!line) return line;

          // --- handle EXT-X-KEY / EXT-X-MAP / any URI="..."
          if (line.includes('URI="')) {
            return await replaceURIWithToken(line, baseUrl);
          }

          // --- keep comments untouched
          if (line.startsWith("#")) return line;

          // --- rewrite segment URLs
          const absoluteUrl = new URL(line, baseUrl).toString();
          const token = await createVideoToken(absoluteUrl);
          return `/api/video/${token}`;
        }),
      );

      playlist = processedLines.join("\n");

      return new Response(playlist, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": process.env.HOST,
        },
      });
    }

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("connection");

    responseHeaders.set("Access-Control-Allow-Origin", process.env.HOST);
    responseHeaders.set("Cache-Control", "no-store");
    responseHeaders.set("Vary", "Origin");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching video", { status: 500 });
  }
}
