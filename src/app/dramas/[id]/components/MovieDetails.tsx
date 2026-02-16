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
import { getDramaCredits, getDramaDetails } from "@/lib/api/server";
import { formatViews, getPrevNextEpisode, isChannelIdMatch } from "@/lib/utils";
import { format } from "date-fns";
import sanitizeHtml from "sanitize-html";
import { CategoryTypeNameEnum } from "@/types";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeList from "./EpisodeList";

interface MovieDetailsProps {
  id: string;
  channel_id?: string;
}

export default async function MovieDetail({
  id,
  channel_id,
}: MovieDetailsProps) {
  const dramaDetails = await getDramaDetails({
    id,
    page: 1,
    count: 20,
    isAPKvalid: true,
    channel_id,
  });

  const drama = dramaDetails.posts.find((post) =>
    isChannelIdMatch(Number(channel_id), post.channel_id, 0),
  );
  const dramaCredits = await getDramaCredits({
    type:
      dramaDetails.category_type === CategoryTypeNameEnum.MOVIE
        ? "movie"
        : "tv",
    query: dramaDetails.category_name,
  });

  const episode = {
    title: drama?.channel_name || dramaDetails.category.category_name,
    created: drama?.created,
    views: drama?.count_view,
    videoSrc: {
      channelId: Number(channel_id),
      hd: dramaDetails.channel_url_hd,
      sd: dramaDetails.channel_url,
    },
    isHdAvailable: dramaDetails.is_hd_available,
    poster: dramaDetails.img_url,
    ...getPrevNextEpisode(
      dramaDetails.posts,
      channel_id
        ? Number(channel_id)
        : dramaDetails.posts[0]?.channel_id || dramaDetails.category.cid,
    ),
  };

  return (
    <main className="container mx-auto p-4 sm:p-5 space-y-8">
      <VideoPlayer
        src={episode.videoSrc}
        isHdAvailable={episode.isHdAvailable}
        poster={episode.poster}
        nextEpisode={episode.next}
        prevEpisode={episode.prev}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-start justify-between mb-2">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
              {episode.title}
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
                  <span className="font-semibold">
                    {dramaDetails.category.rating}
                  </span>{" "}
                  /10
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {episode.created
                    ? format(episode.created, "PPP")
                    : dramaDetails.years}
                </span>
              </div>
              {episode.views && (
                <div className="flex items-center gap-1">
                  <Eye className="size-5 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {formatViews(Number(episode.views))} views
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              {dramaDetails.category.genre?.split(",").map((genre) => (
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
              {parse(sanitizeHtml(dramaDetails.channel_description))}
            </CardContent>
          </Card>
          {!!dramaCredits.cast.length && (
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
          )}
        </div>
        <div className="space-y-6">
          {dramaDetails.category.category_type !==
            CategoryTypeNameEnum.MOVIE && (
            <EpisodeList
              id={id}
              channel_id={channel_id ?? ""}
              pageSize={dramaDetails.count}
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
                <p>{dramaDetails.category_name}</p>
              </div>
              <div>
                <h3 className="text-sm  text-muted-foreground">Type</h3>
                <p>{dramaDetails.category_type}</p>
              </div>
              <div>
                <h3 className="text-sm  text-muted-foreground">Episodes</h3>
                <p>
                  {dramaDetails.category.category_type ===
                  CategoryTypeNameEnum.MOVIE
                    ? "Movie"
                    : `${dramaDetails.count_total} episodes`}
                </p>
              </div>
              <div>
                <h3 className="text-sm  text-muted-foreground">Status</h3>
                <Badge variant="outline">
                  {dramaDetails.category.ongoing ? "Ongoing" : "Completed"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
