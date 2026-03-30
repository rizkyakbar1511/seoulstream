import { Film } from "lucide-react";

export default function SearchFallback({ message }: { message: string }) {
    return <div className="flex flex-col gap-2 items-center justify-center p-6 text-center text-muted-foreground">
        <Film className="size-8 opacity-50" />
        <p className="text-sm">{message}</p>
    </div>
}