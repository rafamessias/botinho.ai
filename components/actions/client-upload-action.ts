'use server';

import { revalidateTag } from 'next/cache';
import { PrismaClient } from '@/lib/generated/prisma';
import { requireSession } from './check-session';
import { prismaWithCompany } from './prisma-with-company';

// Initialize Prisma client
const prisma = new PrismaClient();

export interface ClientUploadResult {
    publicId: string;
    url: string;
    format: string;
    size: number;
    name: string;
}

export interface CreateFileRecordParams {
    uploadResults: ClientUploadResult[];
    tableName: string;
    recordId: number;
    fieldName: string;
}

export interface CreateFileRecordResult {
    success: boolean;
    data?: {
        id: number;
        url: string;
        publicId: string;
        name: string;
        format: string;
        size: number;
    }[];
    error?: string;
}

/**
 * Creates File records in Prisma and updates the referenced table
 * This is called after client-side uploads are completed
 */
export async function createFileRecords({
    uploadResults,
    tableName,
    recordId,
    fieldName
}: CreateFileRecordParams): Promise<CreateFileRecordResult> {
    try {
        // Check authentication
        await requireSession();

        if (!uploadResults || uploadResults.length === 0) {
            return {
                success: true,
                data: []
            };
        }

        // Create File records in Prisma
        const fileRecords = await Promise.all(
            uploadResults.map(async (result) => {
                return await prismaWithCompany.file.create({
                    name: result.name,
                    publicId: result.publicId,
                    format: result.format,
                    version: '1', // Default version for client uploads
                    url: result.url,
                    mimeType: getMimeTypeFromFormat(result.format),
                    size: result.size,
                });
            })
        );

        // Update the referenced table record
        let updateResult;

        switch (tableName.toLowerCase()) {
            case 'user':
                if (fieldName === 'avatarId' && fileRecords.length > 0) {
                    updateResult = await prisma.user.update({
                        where: { id: recordId },
                        data: { avatarId: fileRecords[0].id }
                    });
                }
                break;

            case 'company':
                if (fieldName === 'logoId' && fileRecords.length > 0) {
                    updateResult = await prisma.company.update({
                        where: { id: recordId },
                        data: { logoId: fileRecords[0].id }
                    });
                } else if (fieldName === 'coverImageId' && fileRecords.length > 0) {
                    updateResult = await prisma.company.update({
                        where: { id: recordId },
                        data: { coverImageId: fileRecords[0].id }
                    });
                }
                break;

            case 'project':
                if (fieldName === 'imageId' && fileRecords.length > 0) {
                    updateResult = await prisma.project.update({
                        where: { id: recordId },
                        data: { imageId: fileRecords[0].id }
                    });
                }
                break;

            case 'rdo':
                if (fieldName === 'media') {
                    // For RDO, create many-to-many relationships
                    updateResult = await prisma.rDO.update({
                        where: { id: recordId },
                        data: {
                            media: {
                                connect: fileRecords.map(file => ({ id: file.id }))
                            }
                        }
                    });
                }
                break;

            case 'incident':
                if (fieldName === 'media') {
                    // For Incident, create many-to-many relationships
                    updateResult = await prisma.incident.update({
                        where: { id: recordId },
                        data: {
                            media: {
                                connect: fileRecords.map(file => ({ id: file.id }))
                            }
                        }
                    });
                }
                break;

            default:
                throw new Error(`Unsupported table: ${tableName}`);
        }

        // Revalidate relevant cache tags
        revalidateTag(`${tableName.toLowerCase()}:${recordId}`);
        revalidateTag(`${tableName.toLowerCase()}s`);

        return {
            success: true,
            data: fileRecords.map(file => ({
                id: file.id,
                url: file.url,
                publicId: file.publicId || '',
                name: file.name,
                format: file.format || '',
                size: file.size || 0
            }))
        };

    } catch (error) {
        console.error('Error creating file records:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while creating file records'
        };
    }
}

/**
 * Helper function to get MIME type from file format
 */
function getMimeTypeFromFormat(format: string): string {
    const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo'
    };
    //console.log('format', format);
    return mimeTypes[format?.toLowerCase()] || 'application/octet-stream';
}
