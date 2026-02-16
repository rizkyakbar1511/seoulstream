// components/LoadMore.tsx
"use client";

import { LoaderCircleIcon } from "lucide-react";
import { InView } from "react-intersection-observer";
import {
  type FetchNextPageOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { TIME } from "@/constants";

interface LoadMoreProps<TPage, TItem> {
  queryKey: string[]; // Required for caching — e.g., ['posts'], ['products', categoryId]
  fetcher: (pageParam: number) => Promise<TPage>; // pageParam instead of page
  children: (props: {
    items: TItem[];
    isLoading: boolean;
    error: Error | null;
    fetchNextPage: (options?: FetchNextPageOptions) => void;
    isFetchingNextPage: boolean;
  }) => React.ReactNode;
  initialPageParam?: number;
  getNextPageParam: (
    lastPage: TPage,
    allPages: TPage[],
    lastPageParam: number,
  ) => number | undefined;
  loader?: React.ReactNode;
  selectItems: (page: TPage) => TItem[];
}

export default function LoadMore<TPage, TItem>({
  queryKey,
  fetcher,
  children,
  initialPageParam = 1,
  getNextPageParam,
  loader = <LoaderCircleIcon className="animate-spin size-4" />,
  selectItems,
}: LoadMoreProps<TPage, TItem>) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = initialPageParam }) => {
      const result = await fetcher(pageParam);
      return result;
    },
    initialPageParam,
    getNextPageParam,
    staleTime: TIME.FIVE_MINUTES, // cache for 5 minutes
  });

  // Flatten all pages into single array for rendering
  const allItems = data?.pages.flatMap((page) => selectItems(page)) ?? [];

  return (
    <>
      {/* Render current items */}
      {children({
        items: allItems,
        isLoading,
        error: error instanceof Error ? error : null,
        fetchNextPage,
        isFetchingNextPage,
      })}

      {/* Trigger area — only show if there's next page */}
      {hasNextPage && (
        <InView
          as="div"
          onChange={(inView) => {
            if (inView && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          className="flex items-center justify-center py-4"
        >
          {isFetchingNextPage ? (
            loader
          ) : (
            <span className="text-sm text-gray-500">
              Scroll to load more...
            </span>
          )}
        </InView>
      )}

      {/* Optional: Show "end" message */}
      {!hasNextPage && allItems.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          🎉 That’s all!
        </div>
      )}

      {/* Optional: Global loading state (first load) */}
      {status === "pending" && allItems.length === 0 && (
        <div className="flex items-center justify-center py-8">
          {loader} <span className="ml-2">Loading...</span>
        </div>
      )}

      {/* Optional: Error UI */}
      {status === "error" && (
        <div className="text-center py-4 text-red-500">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}
    </>
  );
}
