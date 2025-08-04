"use server"

import { auth } from "@/app/auth";

/**
 * Checks if the user is authenticated on the server.
 * Throws an error if not authenticated.
 * Returns the user session if authenticated.
 */
export async function requireSession() {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Not authenticated");
    }
    return session.user;
}
