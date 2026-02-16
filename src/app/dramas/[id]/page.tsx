import { Suspense } from "react";
import MovieDetails from "@/app/dramas/[id]/components/MovieDetails";
import MovieDetailsLoading from "./components/MovieDetailsLoading";

interface DramasPageProps {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ channel_id?: string }>,
}

export default async function DramasPage({ params, searchParams }: DramasPageProps) {
    const { id } = await params;
    const { channel_id } = await searchParams;

    return <Suspense fallback={<MovieDetailsLoading />}>
        <MovieDetails id={id} channel_id={channel_id} />
    </Suspense>
}