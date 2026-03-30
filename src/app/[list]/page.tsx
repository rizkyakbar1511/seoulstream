import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import DramaListContainer from "./components/DramaListContainer";
import DramaSectionLoading from "@/features/drama/components/DramaSectionLoading";

const VALID_MOVIE_LISTS = ["all", "ongoing", "new-releases"];

export default async function DramaListPage({
  params,
  searchParams,
}: PageProps<"/[list]">) {
  const { list } = await params;
  const { page, limit } = await searchParams;

  if (!VALID_MOVIE_LISTS.includes(list)) notFound();

  const title = {
    all: "All Dramas",
    ongoing: "Ongoing",
    "new-releases": "New Releases",
  };

  return (
    <main className="space-y-3 container mx-auto p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title[list as keyof typeof title]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense
        fallback={
          <DramaSectionLoading skeletonContentLength={20} variant="grid" />
        }
      >
        <DramaListContainer page={page} list={list} limit={limit} />
      </Suspense>
    </main>
  );
}
