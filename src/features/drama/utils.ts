import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function formatViews(views: number) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

export const getTimestampCaption = (releaseTime: string) => {
  const now = new Date();
  const release = new Date(releaseTime);

  const diffInMinutes = differenceInMinutes(now, release);
  if (diffInMinutes < 1) {
    return "Released: just now";
  }
  if (diffInMinutes < 60) {
    return `Released: ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = differenceInHours(now, release);
  if (diffInHours < 24) {
    return `Released: ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = differenceInDays(now, release);
  if (diffInDays < 30) {
    return `Released: ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = differenceInMonths(now, release);
  if (diffInMonths < 12) {
    return `Released: ${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = differenceInYears(now, release);
  return `Released: ${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};
