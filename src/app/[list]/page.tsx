import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import DramaList from "./components/DramaList";
import MovieSectionLoading from "@/components/movie/MovieSectionLoading";
import { VALID_MOVIE_LISTS } from "@/constants";

interface DramaListPageProps {
    params: Promise<{ [key: string]: string }>,
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function DramaListPage({ params, searchParams }: DramaListPageProps) {
    const { list } = await params;
    const page = (await searchParams).page;
    const limit = (await searchParams).limit ?? "20";

    if (!VALID_MOVIE_LISTS.includes(list)) notFound();

    const title = {
        "all": "All Dramas",
        "ongoing": "Ongoing",
        "new-releases": "New Releases"
    }

    return <main className="space-y-3 container mx-auto p-4 sm:p-5">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{title[list as keyof typeof title]}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <Suspense fallback={<MovieSectionLoading skeletonContentLength={20} />}>
            <DramaList page={page} list={list} limit={limit} />
        </Suspense>
    </main>
}
