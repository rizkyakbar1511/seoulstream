import { type NextRequest, NextResponse } from "next/server";
import { getCategoryPost } from "@/lib/api/server";

export async function POST(request: NextRequest) {
	const body = (await request.json()) as {
		id: string;
		page: number;
		count: number;
		isAPKvalid: boolean;
	};
	const response = await getCategoryPost(body);

	return NextResponse.json(response);
}
