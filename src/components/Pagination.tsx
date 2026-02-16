import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "./ui/button";
import Link from "next/link";

interface PaginationProps {
    className?: {
        root?: string;
        content?: string;
        link?: string;
    },
    variant?: VariantProps<typeof buttonVariants>["variant"],
    currentPage: number;
    totalPages: number;
    basePath?: string; // e.g. "/new-releases"
    /** how many pages to show around the current page (each side) */
    siblingCount?: number;
    limitPerPage?: number
}

const ELLIPSIS = -1;

function buildRange(current: number, total: number, siblingCount = 1) {
    const start = Math.max(1, current - siblingCount);
    const end = Math.min(total, current + siblingCount);
    const range: Array<number> = [];

    if (start > 1) range.push(1);
    if (start > 2) range.push(ELLIPSIS);   // ellipsis

    for (let i = start; i <= end; i++) range.push(i);

    if (end < total - 1) range.push(ELLIPSIS);
    if (end < total) range.push(total);

    return range;
}

function pageHref(basePath: string, page: number, limitPerPage?: number) {
    const params = new URLSearchParams();
    const path = basePath || "/";
    if (page !== 1) params.set("page", `${page}`);
    if (limitPerPage) params.set("limit", String(limitPerPage));
    return `${path}?${params.toString()}`;
}

export default function Pagination({
    currentPage,
    totalPages,
    basePath = "/",
    siblingCount = 1,
    className,
    variant,
    limitPerPage
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const range = buildRange(currentPage, totalPages, siblingCount);
    const prevPage = Math.max(1, currentPage - 1);
    const nextPage = Math.min(totalPages, currentPage + 1);

    const handleEllipsisClick = (isFirstEllipsis: boolean) => {
        let targetPage: number;

        if (isFirstEllipsis) {
            // First ellipsis - jump backward
            // Don't jump to page 1, jump to a reasonable previous page
            const jumpDistance = Math.max(1, siblingCount * 2);
            targetPage = Math.max(1, currentPage - jumpDistance);
        } else {
            // Last ellipsis - jump forward
            const jumpDistance = Math.max(1, siblingCount * 2);
            targetPage = Math.min(totalPages, currentPage + jumpDistance);
        }

        return pageHref(basePath, targetPage, limitPerPage);
    }

    return <PaginationRoot className={className?.root}>
        <PaginationContent className={className?.content}>
            {/** Prev */}
            <PaginationItem>
                {/** use page 1 as fallback */}
                <PaginationPrevious isDisabled={currentPage === 1} href={pageHref(basePath, prevPage, limitPerPage)} />
            </PaginationItem>

            {/** Page links & ellipsis  */}
            {range.map((page, index) => {
                if (page === ELLIPSIS) {
                    const prevPage = range[index - 1];
                    const isFirstEllipsis = prevPage === 1;

                    return <PaginationItem
                        key={`ellipsis-${range[index - 1] ?? "start"}-${range[index + 1] ?? "end"}`} /** to produce unique key */
                    >
                        <Link href={handleEllipsisClick(isFirstEllipsis)}>
                            <PaginationEllipsis />
                        </Link>
                    </PaginationItem>
                }

                return <PaginationItem key={page}>
                    <PaginationLink variant={variant} className={className?.link} href={pageHref(basePath, page, limitPerPage)} isActive={page === currentPage}>{page}</PaginationLink>
                </PaginationItem>
            })}

            {/** Next */}
            <PaginationItem>
                <PaginationNext isDisabled={currentPage === totalPages} href={pageHref(basePath, nextPage, limitPerPage)} />
            </PaginationItem>
        </PaginationContent>
    </PaginationRoot>
}