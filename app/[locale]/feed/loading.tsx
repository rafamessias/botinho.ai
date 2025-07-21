import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Skeleton component for RDO/Incident cards
const FeedCardSkeleton = () => (
    <Card className="p-6 space-y-4">
        <CardHeader className="p-0 relative">
            <div className="absolute top-0 right-0 w-full flex justify-end items-center gap-2 -mt-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
            {/* Title */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Media placeholder */}
            <div className="space-y-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="flex gap-2">
                    <Skeleton className="h-2 w-16" />
                    <Skeleton className="h-2 w-12" />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </CardContent>
    </Card>
);

export default function FeedLoading() {
    return (
        <div className="max-w-[600px] mx-auto w-full">
            <div className="flex-1 overflow-y-auto pb-20 space-y-10">
                <Tabs defaultValue="rdos" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="rdos" disabled>
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="ml-1 h-5 w-5 rounded-full" />
                        </TabsTrigger>
                        <TabsTrigger value="incidents" disabled>
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="ml-1 h-5 w-5 rounded-full" />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rdos" className="space-y-10">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <FeedCardSkeleton key={index} />
                        ))}
                    </TabsContent>

                    <TabsContent value="incidents" className="space-y-10">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <FeedCardSkeleton key={index} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 