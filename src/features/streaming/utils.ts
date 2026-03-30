import { CategoryPostResponse } from "@/types";

export const formatVideoTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0)
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getAdjacentEpisodes = (
  posts: CategoryPostResponse["posts"],
  currentChannelId: number,
) => {
  const index = posts.findIndex((post) => post.channel_id === currentChannelId);

  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return {
    prev,
    next,
  };
};

export const isChannelIdMatch = (
  channel_id: number | undefined,
  post_channel_id: number,
  index: number,
) => {
  return channel_id ? Number(channel_id) === post_channel_id : index === 0;
};
