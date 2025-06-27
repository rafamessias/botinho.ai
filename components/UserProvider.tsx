'use client'
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { getUserMe } from "@/components/actions/get-user-me-action";
import { ApiResponse } from "./types/strapi";
import { User } from "./types/strapi";


type UserContextType = {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
};

const LoadingLayer = () => (
    <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
            <div className="h-8 w-8 rounded-full bg-primary animate-pulse" />
        </div>
    </div>
)

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Fetch user from server action on mount
        (async () => {
            setLoading(true);
            const me: ApiResponse<User> = await getUserMe();
            if (me.success) {
                setUser(me.data as User);

                if (me.data?.language && typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    const pathSegments = currentPath.split('/');
                    const currentLocale = pathSegments[1];

                    if (currentLocale !== me.data.language) {
                        // Replace the current locale with the user's preferred locale
                        pathSegments[1] = me.data.language;
                        const newPath = pathSegments.join('/');
                        window.location.href = newPath;
                    }
                }

            } else {
                //console.error(me.error);
                setUser(null);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {loading && <LoadingLayer />}
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
} 