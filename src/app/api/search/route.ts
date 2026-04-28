import { type NextRequest, NextResponse } from "next/server";
import { fetchDramaSearch } from "@/features/drama/server/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchDramaSearch(body);

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to search drama" },
      { status: 500 },
    );
  }
}
