import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
    return (
        <div className="container max-w-[1280px] pb-12 pt-6 sm:pt-12">
            <div className="relative mx-auto w-full max-w-[680px] px-6 py-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col gap-6">
                    {/* Avatar Upload */}
                    <div className="flex gap-2">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-20 w-20 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* RDO Notification Toggle */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>

                    {/* Delete Profile Button */}
                    <div className="border-t pt-6 mt-6">
                        <div className="text-center">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 