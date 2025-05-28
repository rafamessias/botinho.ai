'use client'
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { },
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingContext);
} 