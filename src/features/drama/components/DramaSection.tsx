"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DramaList from "./DramaList";
import Link from "next/link";
import type { DramaListResult } from "../types";

interface DramaSectionProps {
  title: string;
  data: DramaListResult;
  viewAllHref: string;
  variant: "grid" | "carousel";
}
export default function DramaSection({
  title,
  data,
  viewAllHref,
  variant,
}: DramaSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl after:relative after:bg-primary after:mt-1 after:w-10 after:h-1.5 after:rounded-lg after:block">
          {title}
        </h2>
        <Button variant="link" asChild>
          <Link href={viewAllHref}>
            View All
            <ChevronRight className="size-3 ml-1" />
          </Link>
        </Button>
      </div>
      <DramaList data={data} variant={variant} />
    </section>
  );
}
