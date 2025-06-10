'use client'

import { useLoading } from "./LoadingProvider"
import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 bg-background/80 rounded-lg backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    );
} 