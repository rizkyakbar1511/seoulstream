"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectItemsPerPageProps {
    triggerClassName?: string;
    contentClassName?: string;
}

export default function SelectItemsPerPage({ triggerClassName, contentClassName }: SelectItemsPerPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        params.set("limit", value);
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const currentLimit = searchParams.get('limit') || '20';

    return <Select value={currentLimit} onValueChange={handleValueChange}>
        <SelectTrigger className={triggerClassName} size="sm">
            <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
        </SelectContent>
    </Select>
}