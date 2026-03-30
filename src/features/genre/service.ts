import { getGenreList } from "./api";
import { mapGenreList } from "./mapper";

export async function fetchGenreList() {
  const res = await getGenreList();
  return mapGenreList(res);
}
