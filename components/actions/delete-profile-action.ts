"use server";

import { cookies } from "next/headers";
import { fetchContentApi } from "./fetch-content-api";
import { User, CompanyMember, ProjectUser } from "../types/strapi";

export async function deleteProfileAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        // First, get the user to check if they are a company owner
        const userResponse = await fetchContentApi<User>(`users/me`);

        if (!userResponse.success || !userResponse.data) {
            throw new Error('Failed to fetch user data');
        }

        const user = userResponse.data;

        // Check if user is a company owner
        if (user.companyMember?.isOwner) {
            throw new Error('Company owners cannot delete their profile');
        }

        // 1. Remove user from all company memberships

        const companyMembersResponse = await fetchContentApi<CompanyMember[]>(`company-members?filters[userId][$eq]=${user.id}`, {
            method: 'GET'
        });

        if (companyMembersResponse.success && companyMembersResponse.data) {
            for (const member of companyMembersResponse.data) {
                await fetchContentApi(`company-members/${member.documentId}`, {
                    method: 'DELETE'
                });
            }
        }

        // 2. Remove user from all project users (filter by email since ProjectUser has email field)
        const projectUsersResponse = await fetchContentApi<ProjectUser[]>(`project-users?filters[email][$eq]=${user.email}`, {
            method: 'GET'
        });

        if (projectUsersResponse.success && projectUsersResponse.data) {
            for (const projectUser of projectUsersResponse.data) {
                await fetchContentApi(`project-users/${projectUser.documentId}`, {
                    method: 'DELETE'
                });
            }
        }

        // 3. Delete the user record
        const deactivationTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const deactivatedValue = `${user.email}_deactivated_${deactivationTimestamp}`;

        console.log("deactivatedValue", deactivatedValue);

        console.log("user.documentId", user.documentId);
        const deleteUserResponse = await fetchContentApi(`users/${user.documentId}`, {
            method: 'PUT',
            body: {
                data: {
                    blocked: true,
                    email: deactivatedValue
                }
            }
        });

        if (!deleteUserResponse.success) {
            console.log(`error deleting user`, deleteUserResponse?.error);
            throw new Error('Failed to delete user');
        }

        // 4. Clear the JWT cookie
        cookieStore.set('jwt', '', {
            expires: new Date(0),
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return { success: true, message: 'Profile deleted successfully' };
    } catch (error) {
        console.error('Error deleting profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete profile'
        };
    }
} 