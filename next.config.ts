import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // This wildcard allows all hostnames
			},
		],
	},
};

export default nextConfig;
