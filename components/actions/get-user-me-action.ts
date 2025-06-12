"use server"

import { cookies } from "next/headers"
import { fetchContentApi } from "./fetch-content-api";
import { User, ApiResponse } from "../types/strapi";
export async function getUserMe() {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt");

    if (!jwt) {
        return { success: false, data: null, meta: null, error: "No JWT found" } as ApiResponse<User>;
    }

    const user: ApiResponse<User> = await fetchContentApi<User>(`users/me?populate=*`, {
        token: jwt.value
    })

    if (!user.success) {
        // Remove cookies
        const cookieStore = await cookies();
        cookieStore.delete("jwt");
        return { success: false, data: null, meta: null, error: "Failed to fetch user" } as ApiResponse<User>;
    }

    return { success: true, data: user.data, meta: user.meta } as ApiResponse<User>;
}