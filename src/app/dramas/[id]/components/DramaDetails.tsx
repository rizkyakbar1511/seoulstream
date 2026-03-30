import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookType,
  Calendar,
  Eye,
  Heart,
  Share2,
  Star,
  UsersRound,
} from "lucide-react";
import parse from "html-react-parser";
import { format } from "date-fns";
import sanitizeHtml from "sanitize-html";
import DramaEpisodeList from "./DramaEpisodeList";
import { fetchDramaWatchData } from "@/features/drama/server/service";
import { formatViews } from "@/features/drama/utils";
import { DramaCategoryTypeEnum } from "@/features/drama/types";
import { VideoPlayer } from "@/features/video-player/components/VideoPlayer";

interface MovieDetailsProps {
  id: string;
  channel_id?: string | string[];
}

export default async function DramaDetails({
  id,
  channel_id,
}: MovieDetailsProps) {
  const {
    drama,
    descriptionHtml,
    isHdAvailable,
    meta,
    video,
    prevEpisode,
    nextEpisode,
  } = await fetchDramaWatchData({
    id: Number(id),
    channel_id: channel_id ? Number(channel_id) : undefined,
    count: 20,
    page: 1,
    isAPKvalid: true,
  });

  return (
    <main className="container mx-auto p-4 sm:p-5 space-y-8">
      <VideoPlayer
        src={video}
        title={drama.title}
        poster={drama.poster}
        isHdAvailable={isHdAvailable}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-start justify-between mb-2">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
              {drama.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Heart />
              </Button>
              <Button variant="outline">
                <Share2 />
              </Button>
            </div>
          </div>
          <div className="mb-6 space-y-5">
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold">{drama.rating}</span>/10
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {drama.updatedAt
                    ? format(drama.updatedAt, "PPP")
                    : drama.year}
                </span>
              </div>
              {drama.views && (
                <div className="flex items-center gap-1">
                  <Eye className="size-5 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {formatViews(Number(drama.views))} views
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              {drama.genre?.split(",").map((genre) => (
                <Badge key={genre.trim()} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookType className="size-6" /> Synopsis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-base break-words whitespace-normal">
              {parse(sanitizeHtml(descriptionHtml))}
            </CardContent>
          </Card>
          {/*{!!dramaCredits.cast.length && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className="size-6" /> Cast
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dramaCredits.cast.map((actor) => (
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    key={actor.credit_id}
                  >
                    <Avatar className="size-20 mb-2">
                      <AvatarImage
                        className="object-cover"
                        src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/w500/${actor.profile_path}`}
                      />
                      <AvatarFallback>{actor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-sm break-words whitespace-normal">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate break-words whitespace-normal">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {!!dramaCredits.crew.length && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className="size-6" /> Crew
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dramaCredits.crew.map((actor) => (
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    key={actor.credit_id}
                  >
                    <Avatar className="size-20 mb-2">
                      <AvatarImage
                        className="object-cover"
                        src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/w92/${actor.profile_path}`}
                      />
                      <AvatarFallback>{actor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-sm break-words whitespace-normal">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate break-words whitespace-normal">
                      {actor.job}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}*/}
        </div>
        <div className="space-y-6">
          {drama.type !== DramaCategoryTypeEnum.MOVIE && (
            <DramaEpisodeList
              id={id}
              channel_id={channel_id ?? ""}
              pageSize={meta.perPage}
              queryKey={["episodes", id]}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle>Series Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-sm  text-muted-foreground">Title</h3>
                <p>{drama.title}</p>
              </div>
              <div>
                <h3 className="text-sm  text-muted-foreground">Type</h3>
                <p>{drama.type}</p>
              </div>
              <div>
                <h3 className="text-sm  text-muted-foreground">Episodes</h3>
                <p>
                  {drama.type === DramaCategoryTypeEnum.MOVIE
                    ? "Movie"
                    : `${meta.totalItems} episodes`}
                </p>
              </div>
              <div>
                <h3 className="text-sm  text-muted-foreground">Status</h3>
                <Badge variant="outline">
                  {drama.ongoing ? "Ongoing" : "Completed"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
