import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailsLoading() {
    return <main className="container mx-auto p-4 sm:p-5 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-2">
                    <Skeleton className="h-8 w-2/3" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                </div>
                <div className="mb-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        {["first", "second", "third"].map((label) => (
                            <Skeleton key={label} className="h-6 w-16 rounded-full" />
                        ))}
                    </div>
                </div>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-24" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-24" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const uniqueKey = `skeleton-item-${i}-${Math.random().toString(36).substr(2, 9)}`;
                            return (
                                <div key={uniqueKey} className="flex items-center justify-between p-3 rounded-lg">
                                    <div>
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-6 w-10 rounded-full" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-32" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </main>
}