import { type NextRequest, NextResponse } from "next/server";
import { fetchDramaCategoryPosts } from "@/features/drama/server/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchDramaCategoryPosts(body);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch category posts" },
      { status: 500 },
    );
  }
}
