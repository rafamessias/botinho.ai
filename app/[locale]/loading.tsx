import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function HomepageLoading() {
    return (
        <div className="container max-w-[1280px] pb-12 pt-6 sm:pt-12">
            <div className="relative mx-auto w-full">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full">
                        <Skeleton className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Skeleton className="flex h-9 w-full rounded-md border px-3 py-1 pl-10" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-[180px] rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden pb-6 shadow-sm">
                            {/* Project Image */}
                            <div className="relative h-48">
                                <Skeleton className="w-full h-48" />
                                <div className="absolute top-4 right-4">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>

                            {/* Project Content */}
                            <CardContent className="p-6 space-y-4">
                                {/* Project Title and Status */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-1/2" />
                                </div>

                                {/* Project Description */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </div>

                                {/* Project Stats */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-8" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-8" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-8" />
                                    </div>
                                </div>

                                {/* Project Address */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4">
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                    <Skeleton className="h-8 w-24 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
} 