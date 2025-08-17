import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProjectViewLoading() {
    return (
        <Card className="container max-w-[680px] pb-12 pt-6 sm:pt-12 mt-12">
            <CardContent className="relative mx-auto w-full">
                <div className="flex flex-col gap-8">
                    {/* Project Image Header */}
                    <div className="absolute top-0 left-0 w-full h-48 rounded-t-lg overflow-hidden">
                        <Skeleton className="w-full h-48" />
                    </div>

                    {/* Edit Button */}
                    <div className="w-full flex justify-end items-center gap-2 mt-[198px]">
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>

                    {/* Project Info Card */}
                    <div className="flex flex-col gap-6 px-4 pb-4 bg-white rounded-lg">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="rounded-xl">
                        <Tabs defaultValue="rdos" className="w-full relative">
                            <TabsList className="absolute flex flex-row justify-stretch w-full bg-transparent overflow-x-auto">
                                <TabsTrigger value="rdos" disabled className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="ml-1 h-5 w-5 rounded-full" />
                                </TabsTrigger>
                                <TabsTrigger value="incidents" disabled className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="ml-1 h-5 w-5 rounded-full" />
                                </TabsTrigger>
                                <TabsTrigger value="users" disabled className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="ml-1 h-5 w-5 rounded-full" />
                                </TabsTrigger>
                            </TabsList>

                            <div className="pt-16">
                                <TabsContent value="rdos" className="space-y-6">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <Card key={index} className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
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
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                            <Skeleton className="h-32 w-full rounded-lg" />
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="incidents" className="space-y-6">
                                    {Array.from({ length: 2 }).map((_, index) => (
                                        <Card key={index} className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
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
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                            <Skeleton className="h-32 w-full rounded-lg" />
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="users" className="space-y-6">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 