"use client";

import dynamic from "next/dynamic";
import DramaSearchDialog from "@/features/drama/components/DramaSearchDialog";
import Link from "next/link";
import { LoaderCircleIcon, Shuffle } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { shuffleDrama } from "@/features/drama/server/actions";

const ThemeSwitcher = dynamic(() => import("@/components/ThemeSwitcher"), {
  ssr: false,
  loading: () => <LoaderCircleIcon className="animate-spin size-4" />,
});

const Header: React.FC = () => {
  const [isPending, startTransition] = useTransition();

  function handleShuffle() {
    startTransition(async () => {
      await shuffleDrama();
    });
  }

  return (
    <header className="flex justify-between items-center container mx-auto p-4 sm:p-6 sticky top-0 backdrop-blur-md bg-white/70 dark:bg-black/50 z-30">
      <Link className="transition hover:opacity-80" href="/">
        <h1 className="font-bold text-xl">
          <span className="text-primary">Seoul</span>Stream
        </h1>
      </Link>
      <DramaSearchDialog />
      <div className="flex items-center gap-1">
        <Button onClick={handleShuffle} size="icon" variant="ghost">
          {isPending && <LoaderCircleIcon className="size-4 animate-spin" />}
          {!isPending && <Shuffle className="size-4" />}
        </Button>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
