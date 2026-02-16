// app/api/video-proxy/route.ts
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const videoUrl = searchParams.get("url");

	if (!videoUrl) {
		return new Response("URL parameter is required", { status: 400 });
	}

	try {
		// Check if it's a whatbox domain
		const urlObj = new URL(videoUrl);
		const isWhatboxDomain = urlObj.hostname.includes("whatbox.ca");
		console.log("🚀 ~ GET ~ isWhatboxDomain:", isWhatboxDomain);

		// Prepare headers
		const headers: Record<string, string> = {};

		if (isWhatboxDomain) {
			headers["Authorization"] =
				"Basic ZHJha29ybmljb2phbnVhcjpESVZBTlRBcnRCSW5zVHJpU2tFcmVtZU50T01JQ0VyQ2VTTWlRVWFLYXJ5cHNCb2FyaQ==";
			headers["Icy-MetaData"] = "1";
			headers["User-Agent"] =
				"Player DrakorID v1.8/10 Emu:false Root:false PlayStore:true (Linux;Android 11) ExoPlayerLib/2.18.3";
			headers["Accept-Encoding"] = "identity";
			headers["Host"] = "oberon.whatbox.ca:18568";
			headers["Connection"] = "Keep-Alive";
		}

		// Forward range headers for video streaming
		const rangeHeader = request.headers.get("Range");
		if (rangeHeader) {
			headers["Range"] = rangeHeader;
		}

		// Fetch the video
		const response = await fetch(videoUrl, { headers });

		if (!response.ok) {
			return new Response("Failed to fetch video", { status: response.status });
		}

		// Create response with proper headers
		const responseHeaders = new Headers(response.headers);

		// Add CORS headers
		responseHeaders.set("Access-Control-Allow-Origin", "*");
		responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

		// Remove problematic headers
		responseHeaders.delete("content-security-policy");
		responseHeaders.delete("x-frame-options");
		console.log(headers);

		return new Response(response.body, {
			status: response.status,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error("Video proxy error:", error);
		return new Response("Proxy error", { status: 500 });
	}
}

export async function OPTIONS() {
	return new Response(null, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
			"Access-Control-Allow-Headers": "Range, Accept-Encoding, Authorization",
		},
	});
}
