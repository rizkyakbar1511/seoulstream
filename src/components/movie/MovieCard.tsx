import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { Clock, Eye, Star } from "lucide-react"
import { formatViews, getTimestampCaption } from "@/lib/utils"
import type { Category } from "@/types"
import Link from "next/link"
import { IMAGE_BLUR_PLACEHOLDER } from "@/constants"

interface MovieCardProps {
    data: Category
}

export default function MovieCard({ data }: MovieCardProps) {
    return <Link href={`/dramas/${data.cid}`}>
        <Card className="p-0 gap-0 group shadow-2xl dark:shadow-none overflow-hidden rounded-lg">
            <CardHeader className="
            relative size-full aspect-[2/3] xs:aspect-[3/4] sm:aspect-[2/3] md:aspect-[3/4] lg:aspect-[2/3] p-0 overflow-hidden
            after:absolute after:w-full after:h-full after:bottom-0 after:right-0 after:left-0 after:bg-gradient-to-t after:from-card after:to-45% after:to-transparent
            ">
                <Image
                    placeholder="blur"
                    className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    src={data.img_url}
                    fill
                    alt={data.category_name}
                    blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                    sizes="(max-width: 768px) 100vw, 300px"
                />

                {/** STATUS BADGE */}
                {Boolean(data.ongoing) && <Badge className="absolute top-2 left-2 sm:text-sm" variant="destructive">Ongoing</Badge>}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-background px-2 py-1 rounded-md text-xs sm:text-sm">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{data.rating}</span>
                </div>

                {/** TIMESTAMP CAPTION */}
                {data.updated && <div title={getTimestampCaption(data.updated)} className="absolute left-3 bottom-3 right-3 z-10">
                    <Badge className="w-full gap-1 flex items-center">
                        <Clock className="size-4 shrink-0" />
                        <span className="truncate">{getTimestampCaption(data.updated)}</span>
                    </Badge>
                </div>}
            </CardHeader>
            <CardContent className="p-3 space-y-2">
                <h2 className="text-sm md:text-lg font-semibold truncate">{data.category_name}</h2>

                {/* Genre and Year */}
                <div className="flex items-center justify-between gap-2">
                    <span title={data.genre} className="text-xs text-muted-foreground truncate">{data.genre}</span>
                    <span className="text-xs text-muted-foreground">{data.years}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-card-foreground">{data.count_anime} Episode{`${data.count_anime > 1 ? "s" : ""}`}</span>
                    {data.new_episode && <Badge variant="outline" className="text-xs">
                        {data.new_episode}
                    </Badge>}
                </div>
                <div className="flex items-center gap-1">
                    <Eye className="size-4" />
                    <span className="text-xs text-muted-foreground">{formatViews(data.total_views)}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
}