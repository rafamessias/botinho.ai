"use server"

import { cookies } from "next/headers"
import { fetchContentApi } from "./fetch-content-api";
import { User, ApiResponse, CompanyMember, ProjectUser } from "../types/strapi";
export async function getUserMe() {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt");

    if (!jwt) {
        return { success: false, data: null, meta: null, error: "No JWT found" } as ApiResponse<User>;
    }

    const user: ApiResponse<User> = await fetchContentApi<User>(`users/me?populate=*`, {
        token: jwt.value,
        next: {
            revalidate: 300,
            tags: ['me']
        }
    })

    if (!user.success || !user.data) {
        // Remove cookies
        const cookieStore = await cookies();
        cookieStore.delete("jwt");
        return { success: false, data: null, meta: null, error: "Failed to fetch user" } as ApiResponse<User>;
    }

    let userData: User = user.data;

    if (userData.type === "companyUser") {
        const companyMember = await fetchContentApi<CompanyMember[]>(`company-members?filters[user][id][$eq]=${userData.id}`);

        if (companyMember.success && companyMember.data) {
            userData.companyMember = companyMember.data[0];
        }
    } else if (userData.type === "projectUser") {
        const projectUser = await fetchContentApi<ProjectUser[]>(`project-users?populate[0]=project&filters[email][$eq]=${userData.email}`);

        if (projectUser.success && projectUser.data) {
            userData.projectUser = projectUser.data;
        }
    }

    return { success: true, data: userData, meta: user.meta } as ApiResponse<User>;
}