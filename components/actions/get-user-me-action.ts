"use server"

import { cookies } from "next/headers"
import { fetchContentApi } from "./fetch-content-api";
import { User, ApiResponse, CompanyMember } from "../types/strapi";
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

    if (user.data?.type === "companyUser") {
        const companyMember = await fetchContentApi<CompanyMember[]>(`company-members?filters[user][id][$eq]=${user.data.id}`);

        if (companyMember.success && companyMember.data) {
            userData.companyMember = companyMember.data[0];
        }
    }

    return { success: true, data: userData, meta: user.meta } as ApiResponse<User>;
}