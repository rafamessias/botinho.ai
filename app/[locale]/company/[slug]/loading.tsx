import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompanyLoading() {
    return (
        <div className="container max-w-[1280px] pb-12 pt-6 sm:pt-12">
            <div className="relative mx-auto w-full max-w-[680px] px-6 py-6 bg-white rounded-lg shadow-md">
                <div className="space-y-5">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Document Type and Document */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Zip Code and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    {/* Project Counts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>

                    {/* Divider */}
                    <div className="my-4 p-[1px] bg-gray-100 rounded-md" />

                    {/* User List Section */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
} 