import { NextResponse } from "next/server";
import { getDramaCategoryType } from "@/lib/api/server";

export async function GET() {
	const response = await getDramaCategoryType();

	return NextResponse.json(response);
}
