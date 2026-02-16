"use client";

import LoadMore from "@/components/LoadMore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatViews, isChannelIdMatch } from "@/lib/utils";
import type { CategoryPost, CategoryPostResponse } from "@/types";
import Link from "next/link";

interface EpisodeListProps {
  id: string;
  channel_id: string;
  queryKey: string[];
  pageSize: number;
  initialPageParam?: number;
}

export default function EpisodeList({
  id,
  channel_id,
  queryKey,
  pageSize,
  initialPageParam,
}: EpisodeListProps) {
  async function getCategoryPost(pageParam: number) {
    try {
      const response = await fetch("/api/category/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          page: pageParam,
          count: pageSize,
          isAPKvalid: true,
        }),
      });

      return response.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Episodes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        <LoadMore<CategoryPostResponse, CategoryPost>
          queryKey={queryKey}
          fetcher={getCategoryPost}
          selectItems={(page) => page.posts}
          initialPageParam={initialPageParam}
          getNextPageParam={(lastPage) => {
            const currentPage = lastPage.pages;
            const totalPages = Math.ceil(lastPage.count_total / lastPage.count);
            return currentPage < totalPages ? currentPage + 1 : undefined;
          }}
        >
          {({ items: episodes }) =>
            episodes.map((post, index) => (
              <Link
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  isChannelIdMatch(
                    Number(channel_id),
                    post.channel_id,
                    index,
                  ) && "bg-primary text-white",
                )}
                key={post.channel_id}
                href={`/dramas/${post.category_id}?channel_id=${post.channel_id}`}
              >
                <span>
                  <h3 className="text-sm font-medium">{post.channel_name}</h3>
                  <p className="text-xs">
                    {formatViews(Number(post.count_view))} views
                  </p>
                </span>
                {post.is_hd_available && (
                  <Badge
                    variant={
                      isChannelIdMatch(
                        Number(channel_id),
                        post.channel_id,
                        index,
                      )
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
        </LoadMore>
      </CardContent>
    </Card>
  );
}
