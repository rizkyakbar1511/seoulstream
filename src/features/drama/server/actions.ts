"use server";

import { redirect } from "next/navigation";
import { fetchDramaList } from "./service";

export async function shuffleDrama() {
  const { meta } = await fetchDramaList({
    page: 1,
    count: 20,
    isAPKvalid: true,
  });
  const randomPage = Math.floor(Math.random() * meta.totalPages);
  const { dramas } = await fetchDramaList({
    page: randomPage,
    count: 20,
    isAPKvalid: true,
  });
  const randomDrama = dramas[Math.floor(Math.random() * dramas.length)];

  redirect(`/dramas/${randomDrama.id}`);
}
