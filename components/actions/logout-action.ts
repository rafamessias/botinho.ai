"use server";
import { cookies } from "next/headers";

export async function logoutAction() {
    const cookieStore = await cookies();

    // Clear the JWT cookie with proper attributes
    cookieStore.set('jwt', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    // Return success instead of redirecting directly
    // This allows the client to handle the redirect and clear any client-side state
    return new Response(null, {
        status: 200,
    });
}