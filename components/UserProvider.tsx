'use client'
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { getUserMe } from "@/components/actions/get-user-me-action";

type UserContextType = {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user from server action on mount
        (async () => {
            const me = await getUserMe();
            if (me) setUser(me as any);
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