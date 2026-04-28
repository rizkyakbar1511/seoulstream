import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Star } from "lucide-react";
import Link from "next/link";
import { IMAGE_BLUR_PLACEHOLDER } from "@/constants";
import { formatViews, getTimestampCaption } from "../utils";
import type { Drama } from "../types";

interface DramaCardProps {
  data: Drama;
}

export default function DramaCard({ data }: DramaCardProps) {
  return (
    <Link href={`/dramas/${data.id}`}>
      <Card className="p-0 gap-0 group shadow-2xl dark:shadow-none overflow-hidden rounded-lg">
        <CardHeader
          className="
            relative w-full aspect-[2/3] p-0 overflow-hidden
            after:absolute after:w-full after:h-full after:bottom-0 after:right-0 after:left-0 after:bg-gradient-to-t after:from-card after:to-45% after:to-transparent
            "
        >
          <Image
            placeholder="blur"
            className="md:group-hover:scale-105 md:transition-transform md:duration-300 md:ease-in-out"
            src={data.poster}
            fill
            alt={data.title}
            blurDataURL={IMAGE_BLUR_PLACEHOLDER}
            draggable={false}
            loading="lazy"
            fetchPriority="low"
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/** STATUS BADGE */}
          {Boolean(data.ongoing) && (
            <Badge
              className="absolute top-2 left-2 sm:text-sm"
              variant="destructive"
            >
              Ongoing
            </Badge>
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-background px-2 py-1 rounded-md text-xs sm:text-sm">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{data.rating}</span>
          </div>

          {/** TIMESTAMP CAPTION */}
          {data.updatedAt && (
            <div className="absolute left-3 bottom-3 right-3 z-10">
              <Badge className="w-full gap-1 flex items-center">
                <Clock className="size-4 shrink-0" />
                <span className="truncate">
                  {getTimestampCaption(data.updatedAt)}
                </span>
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          <h2 className="text-sm md:text-lg font-semibold truncate">
            {data.title}
          </h2>

          {/* Genre and Year */}
          <div className="flex items-center justify-between gap-2">
            <span
              title={data.genre}
              className="text-xs text-muted-foreground truncate"
            >
              {data.genre}
            </span>
            <span className="text-xs text-muted-foreground">{data.year}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs truncate text-card-foreground">
              {data.episodes} Episode{`${data.episodes > 1 ? "s" : ""}`}
            </span>
            {data.latestEpisode && (
              <Badge variant="outline" className="text-xs">
                {data.latestEpisode}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="size-4" />
            <span className="text-xs text-muted-foreground">
              {formatViews(data.views)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
