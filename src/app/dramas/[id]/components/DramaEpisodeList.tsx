"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isChannelIdMatch } from "@/features/streaming/utils";
import Link from "next/link";
import { formatViews } from "@/features/drama/utils";
import type { DramaWithEpisodesResult } from "@/features/drama/types";
import DramaLoadMoreEpisodes from "@/app/dramas/[id]/components/DramaLoadMoreEpisodes";

interface EpisodeListProps {
  id: string;
  channel_id?: string | string[];
  queryKey: string[];
  pageSize: number;
  initialPageParam?: number;
}

export default function DramaEpisodeList({
  id,
  channel_id,
  queryKey,
  pageSize,
  initialPageParam,
}: EpisodeListProps) {
  async function getCategoryPost(
    pageParam: number,
  ): Promise<DramaWithEpisodesResult> {
    try {
      const response = await fetch("/api/category/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(id),
          page: pageParam,
          count: pageSize,
          isAPKvalid: true,
        }),
      });

      return response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Episodes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        <DramaLoadMoreEpisodes
          queryKey={queryKey}
          fetcher={getCategoryPost}
          selectItems={(page) => page.episodes}
          initialPageParam={initialPageParam}
          getNextPageParam={(lastPage) => {
            const currentPage = lastPage.meta.currentPage;
            const totalPages = lastPage.meta.totalPages;
            return currentPage < totalPages ? currentPage + 1 : undefined;
          }}
        >
          {({ items: episodes }) =>
            episodes.map((episode, index) => (
              <Link
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  isChannelIdMatch(Number(channel_id), episode.id, index) &&
                    "bg-primary text-white",
                )}
                key={episode.id}
                href={`/dramas/${episode.category_id}?channel_id=${episode.id}`}
              >
                <span>
                  <h3 className="text-sm font-medium">{episode.title}</h3>
                  <p className="text-xs">{formatViews(episode.views)} views</p>
                </span>
                {episode.isHdAvailable && (
                  <Badge
                    variant={
                      isChannelIdMatch(Number(channel_id), episode.id, index)
                        ? "secondary"
                        : "default"
                    }
                  >
                    HD
                  </Badge>
                )}
              </Link>
            ))
          }
        </DramaLoadMoreEpisodes>
      </CardContent>
    </Card>
  );
}
