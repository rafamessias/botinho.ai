import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Session utility functions
export async function updateSession() {
    try {
        // Force a page refresh to update the session
        // This is a simple but effective way to ensure the session is updated
        window.location.reload();
    } catch (error) {
        console.error('Error updating session:', error);
    }
}

export async function refreshSession() {
    try {
        // Alternative approach: trigger a session refresh without page reload
        const response = await fetch('/api/auth/session', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });

        if (response.ok) {
            // Optionally trigger a client-side session update
            // This depends on your session management setup
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error refreshing session:', error);
        return false;
    }
} 