"use client";

import dynamic from "next/dynamic";
import MovieSearchDialog from "@/components/movie/MovieSearchDialog";
import Link from "next/link";
import { LoaderCircleIcon, Shuffle } from "lucide-react";
import { Button } from "./ui/button";

const ThemeSwitcher = dynamic(() => import("@/components/ThemeSwitcher"), {
    ssr: false,
    loading: () => <LoaderCircleIcon className="animate-spin size-4" />
});

const Header: React.FC = () => {

    return <header className="flex justify-between items-center container mx-auto p-4 sm:p-6 sticky top-0 backdrop-blur z-30">
        <Link className="transition hover:opacity-80" href="/">
            <h1 className="font-bold text-xl"><span className="text-primary">Seoul</span>Stream</h1>
        </Link>
        <MovieSearchDialog />
        <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost">
                <Shuffle className="size-4" />
            </Button>
            <ThemeSwitcher />
        </div>
    </header>
}

export default Header;