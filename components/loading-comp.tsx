"use client"

import { useEffect, useState } from "react"

export default function LoadingComp({ isLoadingProp: isLoadingProp }: { isLoadingProp: boolean }) {
    const [isLoading, setIsLoading] = useState(isLoadingProp)

    useEffect(() => {
        setIsLoading(isLoadingProp)
    }, [isLoadingProp])

    if (!isLoading) return null

    return (

        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        </div>

    )
}