"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

    // Also clear any other auth-related cookies if they exist
    cookieStore.set('auth-token', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    // Return success instead of redirecting directly
    // This allows the client to handle the redirect and clear any client-side state
    return { success: true };
}

// Alternative function that redirects immediately (for direct server-side logout)
export async function logoutAndRedirect() {
    const cookieStore = await cookies();

    // Clear the JWT cookie with proper attributes
    cookieStore.set('jwt', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    // Also clear any other auth-related cookies if they exist
    cookieStore.set('auth-token', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    // Redirect to sign-in
    redirect("/sign-in");
}