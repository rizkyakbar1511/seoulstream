"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Eye, Filter, Search, Star } from "lucide-react";
import DramaSearchFallback from "@/features/drama/components/DramaSearchFallback";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { formatViews } from "@/features/drama/utils";
import { Badge } from "@/components/ui/badge";
import {
  DramaCategoryTypeEnum,
  type DramaListResult,
  type DramaCategoryTypeList,
} from "../types";

export default function MovieSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    DramaCategoryTypeEnum.KOREAN_SERIES,
  );

  const debouncedQuery = useDebounce(query, 500);
  const router = useRouter();

  const { data: categoryTypeData, isFetching: isFetchingCategory } =
    useQuery<DramaCategoryTypeList>({
      queryKey: ["drama:category-type"],
      queryFn: async () => {
        const res = await fetch("/api/category");
        return res.json();
      },
      refetchOnWindowFocus: false,
    });

  const {
    data: searchData,
    refetch: refetchSearch,
    isFetching,
  } = useQuery<DramaListResult>({
    queryKey: ["search", debouncedQuery, selectedCategory],
    queryFn: async () => {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: 1,
          count: 20,
          isAPKvalid: true,
          pilihan: selectedCategory,
          search: debouncedQuery,
        }),
      });
      return res.json();
    },
    enabled: debouncedQuery.length > 2,
    refetchOnWindowFocus: false,
  });

  const resetSearch = () => {
    setQuery("");
    setSelectedCategory(DramaCategoryTypeEnum.KOREAN_SERIES);
  };

  const onOpenChangeCommandDialog = (open: boolean) => {
    if (!open) {
      resetSearch();
    }
    setOpen(open);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        className="max-sm:bg-transparent max-w-md sm:flex-1 sm:mx-4 ml-auto group"
        variant="secondary"
        onClick={setOpen.bind(null, true)}
      >
        <div className="sm:flex items-center justify-between flex-1 gap-4 hidden">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground group-hover:text-black group-hover:dark:text-white/80 transition-colors" />
            <span className="text-muted-foreground font-thin group-hover:text-black group-hover:dark:text-white/80 transition-colors">
              Search movies, shows...
            </span>
          </div>
          <div className="flex gap-1">
            <kbd className="bg-background text-muted-foreground group-hover:text-black group-hover:dark:text-white/80 transition-colors pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3">
              Ctrl
            </kbd>
            <kbd className="bg-background text-muted-foreground group-hover:text-black group-hover:dark:text-white/80 transition-colors pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3">
              K
            </kbd>
          </div>
        </div>
        <Search className="size-4 sm:hidden" />
      </Button>
      <CommandDialog open={open} onOpenChange={onOpenChangeCommandDialog}>
        <CommandInput
          placeholder="Type movie name, eg. Itaewon"
          value={query}
          onValueChange={setQuery}
          disabled={isFetchingCategory}
        />
        <div
          onScroll={(e) => console.log(e.currentTarget.scrollLeft)}
          className="flex items-start gap-3 p-3 border-b relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-full after:h-full after:bg-gradient-to-l after:from-popover after:to-transparent after:to-30% after:pointer-events-none"
        >
          <Filter className="size-4 opacity-50 shrink-0" />
          <div className="flex items-center gap-2 overflow-scroll scrollbar-hidden">
            {isFetchingCategory
              ? Array.from({ length: 4 }).map(() => (
                  <Skeleton
                    className="h-5 w-20"
                    key={`skeleton-${Math.random()}`}
                  />
                ))
              : categoryTypeData?.items.map((item) => (
                  <Button
                    onClick={() => {
                      setSelectedCategory(item.name);
                      if (debouncedQuery.length > 2) {
                        refetchSearch();
                      }
                    }}
                    className="text-xs h-5 cursor-pointer"
                    key={item.id}
                    size="sm"
                    variant={
                      selectedCategory === item.name ? "default" : "secondary"
                    }
                  >
                    {item.name}
                  </Button>
                ))}
          </div>
        </div>
        <CommandList>
          {isFetching && (
            <div className="space-y-2 p-3">
              {Array.from({ length: 8 }).map(() => (
                <Skeleton
                  className="h-14 w-full"
                  key={`skeleton-${Math.random()}`}
                />
              ))}
            </div>
          )}
          {debouncedQuery.length <= 2 && !isFetching && (
            <DramaSearchFallback message="Type to search movies..." />
          )}
          {!isFetching &&
            debouncedQuery.length > 2 &&
            searchData?.meta.totalItems === 0 && (
              <CommandEmpty>
                <div className="flex items-center flex-col gap-2">
                  <Search className="size-6" />
                  <h6 className="text-sm">
                    No results found for "{debouncedQuery}"
                  </h6>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              </CommandEmpty>
            )}
          <CommandGroup
            heading={
              searchData?.meta.totalItems
                ? `Found ${searchData?.meta.totalItems} results`
                : undefined
            }
          >
            {!isFetching &&
              searchData?.dramas.map((item) => (
                <CommandItem
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  key={item.id}
                  value={item.title}
                  onSelect={() => {
                    resetSearch();
                    setOpen(false);
                    router.push(`/dramas/${item.id}`);
                  }}
                >
                  <div className="relative h-12 w-9 shrink-0 rounded-sm overflow-hidden">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      objectFit="cover"
                      fill
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6>{item.title}</h6>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(item.views)}</span>
                      </div>
                      <Badge variant="outline">
                        {selectedCategory === DramaCategoryTypeEnum.MOVIE
                          ? "Movie"
                          : `Episode ${item.episodes}`}
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
