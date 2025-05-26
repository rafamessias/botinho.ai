"use server"

import { cookies } from "next/headers"
import { fetchContentApi } from "./fetch-content-api";

export async function getUserMe() {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt");

    if (!jwt) {
        return null;
    }

    const user = await fetchContentApi(`users/me?populate=*`, {
        token: jwt.value
    })

    return user;
}