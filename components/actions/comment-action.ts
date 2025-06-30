'use server';

import { cookies } from 'next/headers';
import { fetchContentApi } from './fetch-content-api';
import { ApiResponse, Comment, RDO, Incident } from '@/components/types/strapi';
import { revalidateTag } from 'next/cache';

export async function createComment(data: {
    content: string;
    rdoId?: number;
    incidentId?: number;
}) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const commentData: any = {
            content: data.content,
        };

        if (data.rdoId) {
            commentData.rdo = data.rdoId;
        }

        if (data.incidentId) {
            commentData.incident = data.incidentId;
        }

        const response: ApiResponse<Comment> = await fetchContentApi<Comment>('comments', {
            method: 'POST',
            body: {
                data: commentData
            },
            revalidateTag: [
                data.rdoId ? `comments:rdo:${data.rdoId}` : '',
                data.incidentId ? `comments:incident:${data.incidentId}` : '',
                'comments'
            ].filter(Boolean)
        });

        if (!response.success || !response.data) {
            console.error('Error creating comment:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to create comment',
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating comment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateComment(commentId: string, content: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response: ApiResponse<Comment> = await fetchContentApi<Comment>(`comments/${commentId}`, {
            method: 'PUT',
            body: {
                data: {
                    content: content
                }
            },
            revalidateTag: ['comments']
        });

        if (!response.success || !response.data) {
            console.error('Error updating comment:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to update comment',
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating comment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function deleteComment(commentId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response: ApiResponse<boolean> = await fetchContentApi<boolean>(`comments/${commentId}`, {
            method: 'DELETE',
            revalidateTag: ['comments']
        });

        if (!response.success) {
            console.error('Error deleting comment:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to delete comment'
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting comment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred'
        };
    }
}

export async function getComments(rdoId?: number, incidentId?: number) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        let endpoint = 'comments?populate[user][fields][0]=firstName&populate[user][fields][1]=lastName&populate[user][fields][2]=username&sort[0]=createdAt:desc';

        if (rdoId) {
            endpoint += `&filters[rdo][$eq]=${rdoId}`;
        }

        if (incidentId) {
            endpoint += `&filters[incident][$eq]=${incidentId}`;
        }

        const response: ApiResponse<Comment[]> = await fetchContentApi<Comment[]>(endpoint, {
            method: 'GET'
        });

        if (!response.success) {
            console.error('Error fetching comments:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to fetch comments',
                data: []
            };
        }

        return { success: true, data: response.data || [] };
    } catch (error) {
        console.error('Error fetching comments:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: []
        };
    }
} 