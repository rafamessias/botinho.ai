import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function RdoViewLoading() {
    return (
        <div className="container max-w-[680px] pb-12 pt-6 sm:pt-12 mt-12">
            <div className="relative mx-auto w-full !rounded-none sm:!rounded-xl !shadow-none sm:!shadow-md border border-gray-100 sm:!border-none">
                <Card className="p-6 bg-transparent shadow-none">
                    <CardHeader className="relative sm:static flex flex-col w-full items-start p-0 justify-between">
                        <div className="absolute sm:static top-0 right-0 w-full flex justify-end items-center gap-2 -mt-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
                            <div className="flex items-start order-2 sm:order-1 gap-4">
                                <div className="space-y-2">
                                    <div className="text-xs">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <div className="text-xs mt-1 flex items-center gap-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="text-xs mt-1 flex items-center gap-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col order-1 sm:order-2 gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 p-0">
                        {/* Media Gallery */}
                        <div className="mt-6">
                            <Skeleton className="h-48 w-full rounded-lg" />
                        </div>

                        {/* RDO Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                        </div>

                        {/* RDO Details Grid */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Weather Information */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Work Activities */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32" />
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-1" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-8 w-20 rounded-md" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 