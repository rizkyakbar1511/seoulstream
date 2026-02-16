import { searchDrama } from "@/lib/api/server";
import type { CategoryTypeNameEnum, MovieListRequest } from "@/types";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const body = (await request.json()) as MovieListRequest & {
		pilihan: CategoryTypeNameEnum;
		search: string;
	};
	const response = await searchDrama(body);

	return NextResponse.json(response);
}
