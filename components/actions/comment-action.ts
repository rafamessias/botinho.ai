'use server';

import { prisma } from '@/prisma/lib/prisma';
import { prismaWithCompany } from './prisma-with-company';
import { revalidateTag } from 'next/cache';
import { auth } from '@/app/auth';

export async function createComment(data: {
    content: string;
    rdoId?: number;
    incidentId?: number;
    projectId?: number;
}) {
    try {
        // Get the current session from NextAuth
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error('Not authenticated');
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.company) {
            throw new Error('User must belong to a company');
        }

        const commentData: any = {
            content: data.content,
            userName: `${user.firstName} ${user.lastName || ''}`.trim(),
            userEmail: user.email,
            userId: user.id,
            companyId: user.company.id,
        };

        if (data.rdoId) {
            commentData.rdoId = data.rdoId;
        }

        if (data.incidentId) {
            commentData.incidentId = data.incidentId;
        }

        if (data.projectId) {
            commentData.projectId = data.projectId;
        }

        const comment = await prismaWithCompany.comment.create({
            content: data.content,
            userName: `${user.firstName} ${user.lastName || ''}`.trim(),
            userEmail: user.email,
            userId: user.id,
            ...(data.rdoId && { rdoId: data.rdoId }),
            ...(data.incidentId && { incidentId: data.incidentId }),
            ...(data.projectId && { projectId: data.projectId }),
        });

        // Update comment count on related entities
        if (data.rdoId) {
            await prisma.rDO.update({
                where: { id: data.rdoId },
                data: { commentCount: { increment: 1 } }
            });
        }

        if (data.incidentId) {
            await prisma.incident.update({
                where: { id: data.incidentId },
                data: { commentCount: { increment: 1 } }
            });
        }

        // Revalidate cache
        let revalidateTags = ['comments'];
        if (data.rdoId) {
            revalidateTags.push(`comments:${data.rdoId}`, `rdos:${data.rdoId}`);
        }
        if (data.incidentId) {
            revalidateTags.push(`comments:${data.incidentId}`, `incidents:${data.incidentId}`);
        }

        revalidateTags.forEach(tag => revalidateTag(tag));

        return {
            success: true,
            data: comment
        };
    } catch (error) {
        console.error('Error creating comment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateComment(commentId: number, content: string) {
    try {
        // Get the current session from NextAuth
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error('Not authenticated');
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if comment exists and user owns it
        const existingComment = await prismaWithCompany.comment.findUnique({
            where: { id: commentId }
        });

        if (!existingComment) {
            throw new Error('Comment not found');
        }

        if (existingComment.userId !== user.id) {
            throw new Error('Not authorized to update this comment');
        }

        const comment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content: content,
                userName: `${user.firstName} ${user.lastName || ''}`.trim(),
                userEmail: user.email
            },
            include: {
                user: true,
                rdo: true,
                incident: true,
                project: true,
                company: true
            }
        });

        // Revalidate cache
        revalidateTag('comments');

        return {
            success: true,
            data: comment
        };
    } catch (error) {
        console.error('Error updating comment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function deleteComment(commentId: number, rdoId?: number, incidentId?: number) {
    try {
        // Get the current session from NextAuth
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error('Not authenticated');
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if comment exists and user owns it
        const existingComment = await prismaWithCompany.comment.findUnique({
            where: { id: commentId }
        });

        if (!existingComment) {
            throw new Error('Comment not found');
        }

        if (existingComment.userId !== user.id) {
            throw new Error('Not authorized to delete this comment');
        }

        // Store IDs for updating counts
        const rdoId = existingComment.rdoId;
        const incidentId = existingComment.incidentId;

        // Delete the comment
        await prisma.comment.delete({
            where: { id: commentId }
        });

        // Update comment count on related entities
        if (rdoId) {
            await prisma.rDO.update({
                where: { id: rdoId },
                data: { commentCount: { decrement: 1 } }
            });
        }

        if (incidentId) {
            await prisma.incident.update({
                where: { id: incidentId },
                data: { commentCount: { decrement: 1 } }
            });
        }

        // Revalidate cache
        let revalidateTags = ['comments'];
        if (rdoId) {
            revalidateTags.push(`comments:${rdoId}`, `rdos:${rdoId}`);
        }
        if (incidentId) {
            revalidateTags.push(`comments:${incidentId}`, `incidents:${incidentId}`);
        }

        revalidateTags.forEach(tag => revalidateTag(tag));

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
        // Get the current session from NextAuth
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error('Not authenticated');
        }

        const whereClause: any = {};

        if (rdoId) {
            whereClause.rdoId = rdoId;
        }

        if (incidentId) {
            whereClause.incidentId = incidentId;
        }

        const comments = await prismaWithCompany.comment.findMany({
            where: whereClause,
            include: {
                user: true,
                rdo: true,
                incident: true,
                project: true,
                company: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            success: true,
            data: comments
        };
    } catch (error) {
        console.error('Error fetching comments:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: []
        };
    }
} 