'use client'
import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { getUserMe } from "@/components/actions/get-user-me-action";
import { ApiResponse, User } from "@/components/types/prisma";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";


type UserContextType = {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
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

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCompanyUser, setIsCompanyUser] = useState(false);
    const [companyMemberCanApprove, setCompanyMemberCanApprove] = useState(false);
    const [companyMemberCanPost, setCompanyMemberCanPost] = useState(false);
    const [companyMemberIsAdmin, setCompanyMemberIsAdmin] = useState(false);
    const [projectUserCanApprove, setProjectUserCanApprove] = useState<(projectId: number) => boolean>(() => () => false);
    const [hasRedirected, setHasRedirected] = useState(false);
    const router = useRouter();
    const locale = useLocale();
    const pathname = usePathname()

    useEffect(() => {
        // Fetch user from server action on mount
        (async () => {
            setLoading(true);

            let me: ApiResponse<User> | null = await getUserMe();

            if (me && me.success) {
                setUser(me.data as User);
                const userData = me.data as User;

                // Only redirect once and only if we haven't redirected yet
                if (userData?.language && !hasRedirected && typeof window !== 'undefined') {
                    const currentLocale = locale

                    if (currentLocale !== userData.language) {
                        setHasRedirected(true);
                        // Replace the current locale with the user's preferred locale
                        const newPath = `${userData.language}${pathname}`;
                        router.push(newPath);
                        return; // Exit early to prevent setting permissions
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
                setLoading(false);

            } else {
                //console.error(me?.error);
                setUser(null);
                setLoading(false);
            }
        })();
    }, [router, hasRedirected]);

    // Remove the second useEffect that was causing duplicate redirects

    if (loading) {
        return <LoadingLayer />;
    }

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            setLoading,
            loading,
            isCompanyUser,
            companyMemberCanApprove,
            companyMemberCanPost,
            companyMemberIsAdmin,
            projectUserCanApprove,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 