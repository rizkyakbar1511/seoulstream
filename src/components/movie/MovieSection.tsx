"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import type { MovieListResponse } from "@/types";
import MovieLists from "./MovieLists";
import Link from "next/link";

interface MovieSectioProps {
    title: string;
    data: MovieListResponse;
    href: string;
    carouselList?: boolean;
}
export default function MovieSection({ title, data, href, carouselList }: MovieSectioProps) {
    return <section className="space-y-3">
        <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl after:relative after:bg-primary after:mt-1 after:w-10 after:h-1.5 after:rounded-lg after:block">{title}</h2>
            <Button variant="link" asChild>
                <Link href={href}>
                    View All
                    <ChevronRight className="size-3 ml-1" />
                </Link>
            </Button>
        </div>
        <MovieLists data={data} carousel={carouselList} />
    </section>
}