"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const StatsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
            <Card
                key={key}
                className="border border-border/40 bg-muted/30 shadow-sm backdrop-blur-sm"
            >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-24 rounded-full bg-muted-foreground/20" />
                    <Skeleton className="h-6 w-6 rounded-full bg-muted-foreground/15" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-8 w-20 rounded-md bg-muted-foreground/20" />
                    <Skeleton className="h-3 w-32 rounded-full bg-muted-foreground/15" />
                </CardContent>
            </Card>
        ))}
    </div>
)


