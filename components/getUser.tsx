'use client'
import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { getUserMe } from "@/components/actions/get-user-me-action";
import { ApiResponse, User } from "@/components/types/prisma";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";

// User Context Interface
interface UserContextType {
    user: User | null;
    loading: boolean;
    setUser: Dispatch<SetStateAction<User | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    updateUser: (userData: User) => void;
    refreshUser: () => Promise<void>;
    // Computed properties for easy access
    isCompanyUser: boolean;
    companyMemberCanApprove: boolean;
    companyMemberCanPost: boolean;
    companyMemberIsAdmin: boolean;
    projectUserCanApprove: (projectId: number) => boolean;
}

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider Component
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    // Function to process user data and calculate permissions
    const processUserData = (userData: User): User => {
        const processedUser = { ...userData };

        // Calculate all permissions synchronously
        processedUser.isCompanyUser = processedUser?.companyMember ? true : false;
        processedUser.companyMemberCanApprove = processedUser?.companyMember ? (
            processedUser?.companyMember.canApprove ||
            processedUser?.companyMember.isAdmin ||
            processedUser?.companyMember.isOwner
        ) : false;
        processedUser.companyMemberCanPost = processedUser?.companyMember ? (
            processedUser?.companyMember.canPost ||
            processedUser?.companyMember.isAdmin ||
            processedUser?.companyMember.isOwner
        ) : false;
        processedUser.companyMemberIsAdmin = processedUser?.companyMember ? (
            processedUser?.companyMember.isAdmin ||
            processedUser?.companyMember.isOwner
        ) : false;
        processedUser.projectUserCanApprove = (projectId: number) => {
            return processedUser?.projectUser ?
                processedUser?.projectUser.some((pu: any) =>
                    pu.canApprove === true && pu.project.id === projectId
                ) : false;
        };

        return processedUser;
    };

    // Function to fetch user data
    const fetchUserData = async (): Promise<User | null> => {
        try {
            const me: ApiResponse<User> | null = await getUserMe();

            if (me?.success && me.data) {
                const processedUser = processUserData(me.data);
                return processedUser;
            }

            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Function to refresh user data
    const refreshUser = async () => {
        setLoading(true);
        try {
            const userData = await fetchUserData();
            setUser(userData);
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Function to update user data
    const updateUser = (userData: User) => {
        const processedUser = processUserData(userData);
        setUser(processedUser);
    };

    // Effect to handle session changes and fetch user data
    useEffect(() => {
        const handleSessionChange = async () => {
            if (status === 'loading') {
                setLoading(true);
                return;
            }

            if (status === 'authenticated' && session?.user) {
                setLoading(true);
                try {
                    const userData = await fetchUserData();
                    setUser(userData);

                    // Handle locale redirect if needed
                    if (userData?.language && typeof window !== 'undefined') {
                        const currentLocale = locale;
                        if (currentLocale !== userData.language) {
                            const newPath = pathname.replace(currentLocale, userData.language);
                            router.push(newPath);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else if (status === 'unauthenticated') {
                setUser(null);
                setLoading(false);
            }
        };

        handleSessionChange();
    }, [session, status, locale, pathname, router]);

    // Computed properties for easy access
    const isCompanyUser = user?.isCompanyUser || false;
    const companyMemberCanApprove = user?.companyMemberCanApprove || false;
    const companyMemberCanPost = user?.companyMemberCanPost || false;
    const companyMemberIsAdmin = user?.companyMemberIsAdmin || false;
    const projectUserCanApprove = user?.projectUserCanApprove || (() => false);

    const value: UserContextType = {
        user,
        loading,
        setUser,
        setLoading,
        updateUser,
        refreshUser,
        isCompanyUser,
        companyMemberCanApprove,
        companyMemberCanPost,
        companyMemberIsAdmin,
        projectUserCanApprove,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to use the user context
export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

// Legacy function for backward compatibility (if needed)
export default async function getUser(): Promise<User | null> {
    try {
        const me: ApiResponse<User> | null = await getUserMe();

        if (me?.success && me.data) {
            const userData = me.data;

            // Calculate all permissions synchronously
            userData.isCompanyUser = userData?.companyMember ? true : false;
            userData.companyMemberCanApprove = userData?.companyMember ? (
                userData?.companyMember.canApprove ||
                userData?.companyMember.isAdmin ||
                userData?.companyMember.isOwner
            ) : false;
            userData.companyMemberCanPost = userData?.companyMember ? (
                userData?.companyMember.canPost ||
                userData?.companyMember.isAdmin ||
                userData?.companyMember.isOwner
            ) : false;
            userData.companyMemberIsAdmin = userData?.companyMember ? (
                userData?.companyMember.isAdmin ||
                userData?.companyMember.isOwner
            ) : false;
            userData.projectUserCanApprove = (projectId: number) => {
                return userData?.projectUser ?
                    userData?.projectUser.some((pu: any) =>
                        pu.canApprove === true && pu.project.id === projectId
                    ) : false;
            };

            return userData as User;
        }

        return null;
    } catch (error) {
        console.error('Error in getUser:', error);
        return null;
    }
}
