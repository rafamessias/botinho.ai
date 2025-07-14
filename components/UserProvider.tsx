'use client'
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { getUserMe } from "@/components/actions/get-user-me-action";
import { ApiResponse } from "./types/strapi";
import { User } from "./types/strapi";


type UserContextType = {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    isCompanyUser: boolean;
    companyMemberCanApprove: boolean;
    companyMemberCanPost: boolean;
    companyMemberIsAdmin: boolean;
    projectUserCanApprove: (projectId: number) => boolean;
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
    setLoading: () => { },
    isCompanyUser: false,
    companyMemberCanApprove: false,
    companyMemberCanPost: false,
    companyMemberIsAdmin: false,
    projectUserCanApprove: () => false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isCompanyUser, setIsCompanyUser] = useState<boolean>(false);
    const [companyMemberCanApprove, setCompanyMemberCanApprove] = useState<boolean>(false);
    const [companyMemberCanPost, setCompanyMemberCanPost] = useState<boolean>(false);
    const [companyMemberIsAdmin, setCompanyMemberIsAdmin] = useState<boolean>(false);
    const [projectUserCanApprove, setProjectUserCanApprove] = useState<(projectId: number) => boolean>(() => () => false);

    useEffect(() => {
        // Fetch user from server action on mount
        (async () => {
            setLoading(true);
            const me: ApiResponse<User> = await getUserMe();
            if (me.success) {
                setUser(me.data as User);
                const userData = me.data as User;

                if (userData?.language && typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    const pathSegments = currentPath.split('/');
                    const currentLocale = pathSegments[1];

                    if (currentLocale !== userData.language) {
                        // Replace the current locale with the user's preferred locale
                        pathSegments[1] = userData.language;
                        const newPath = pathSegments.join('/');
                        window.location.href = newPath;
                    }
                }

                // Calculate all permissions synchronously
                const isCompanyUser = userData?.companyMember ? true : false;
                const companyMemberCanApprove = userData?.companyMember ? (
                    userData?.companyMember.canApprove ||
                    userData?.companyMember.isAdmin ||
                    userData?.companyMember.isOwner
                ) : false;
                const companyMemberCanPost = userData?.companyMember ? (
                    userData?.companyMember.canPost ||
                    userData?.companyMember.isAdmin ||
                    userData?.companyMember.isOwner
                ) : false;
                const companyMemberIsAdmin = userData?.companyMember ? (
                    userData?.companyMember.isAdmin ||
                    userData?.companyMember.isOwner
                ) : false;
                const projectUserCanApprove = (projectId: number) => {
                    return userData?.projectUser ?
                        userData?.projectUser.some((pu: any) =>
                            pu.canApprove === true && pu.project.id === projectId
                        ) : false;
                };

                // Set all states at once
                setIsCompanyUser(isCompanyUser);
                setCompanyMemberCanApprove(companyMemberCanApprove);
                setCompanyMemberCanPost(companyMemberCanPost);
                setCompanyMemberIsAdmin(companyMemberIsAdmin);
                setProjectUserCanApprove(projectUserCanApprove);

            } else {
                //console.error(me.error);
                setUser(null);
            }

            // Only set loading to false after all permissions are calculated and set
            setLoading(false);
        })();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, setLoading, isCompanyUser, companyMemberCanApprove, companyMemberCanPost, companyMemberIsAdmin, projectUserCanApprove }}>
            {loading && <LoadingLayer />}
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
} 