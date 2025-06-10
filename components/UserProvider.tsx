'use client'
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { getUserMe } from "@/components/actions/get-user-me-action";
import { ApiResponse } from "./types/strapi";
import { User } from "./types/strapi";
import { useLoading } from "./LoadingProvider";

type UserContextType = {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const { setIsLoading } = useLoading();

    useEffect(() => {
        // Fetch user from server action on mount
        (async () => {
            setIsLoading(true);
            const me: ApiResponse<User> = await getUserMe();
            if (me.success) {
                setUser(me.data as User);
            } else {
                console.error(me.error);
                setUser(null);
            }
            setIsLoading(false);
        })();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
} 