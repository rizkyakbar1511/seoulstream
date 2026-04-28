import { NextResponse } from "next/server";
import { fetchDramaCategoryTypes } from "@/features/drama/server/service";

export async function GET() {
  try {
    const response = await fetchDramaCategoryTypes();
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch category types" },
      { status: 500 },
    );
  }
}
