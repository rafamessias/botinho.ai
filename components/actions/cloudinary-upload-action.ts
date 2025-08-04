'use server';

import cloudinary from '@/lib/cloudinary';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

export interface UploadFileParams {
    file: File;
    tableName: string; // e.g., 'User', 'Company', 'Project', 'RDO', 'Incident'
    recordId: number;
    fieldName: string; // e.g., 'avatarId', 'logoId', 'imageId', 'media'
    folder?: string; // Optional Cloudinary folder
}

export interface UploadResult {
    success: boolean;
    data?: {
        fileId: number;
        url: string;
        publicId: string;
        name: string;
        format: string;
        size: number;
        mimeType: string;
    };
    error?: string;
}

/**
 * Uploads a file to Cloudinary, creates a File record in Prisma, and updates the referenced table
 */
export async function uploadFileToCloudinary({
    file,
    tableName,
    recordId,
    fieldName,
    folder = 'obraguru'
}: UploadFileParams): Promise<UploadResult> {
    try {
        // Validate inputs
        if (!file || !tableName || !recordId || !fieldName) {
            return {
                success: false,
                error: 'Missing required parameters: file, tableName, recordId, or fieldName'
            };
        }

        // Check authentication (you can modify this based on your auth strategy)
        const cookieStore = await cookies();
        const token = cookieStore.get('authjs.session-token')?.value;

        if (!token) {
            return {
                success: false,
                error: 'Not authenticated'
            };
        }

        // Convert File to Buffer for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'mp4', 'mov', 'avi', 'webp'],
                    transformation: [
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result!);
                }
            );

            uploadStream.end(buffer);
        });

        // Create File record in Prisma
        const fileRecord = await prisma.file.create({
            data: {
                name: file.name,
                publicId: uploadResult.public_id,
                format: uploadResult.format,
                version: uploadResult.version.toString(),
                url: uploadResult.secure_url,
                mimeType: file.type,
                size: file.size,
            }
        });

        // Update the referenced table record
        let updateResult;

        switch (tableName.toLowerCase()) {
            case 'user':
                if (fieldName === 'avatarId') {
                    updateResult = await prisma.user.update({
                        where: { id: recordId },
                        data: { avatarId: fileRecord.id }
                    });
                }
                break;

            case 'company':
                if (fieldName === 'logoId') {
                    updateResult = await prisma.company.update({
                        where: { id: recordId },
                        data: { logoId: fileRecord.id }
                    });
                } else if (fieldName === 'coverImageId') {
                    updateResult = await prisma.company.update({
                        where: { id: recordId },
                        data: { coverImageId: fileRecord.id }
                    });
                }
                break;

            case 'project':
                if (fieldName === 'imageId') {
                    updateResult = await prisma.project.update({
                        where: { id: recordId },
                        data: { imageId: fileRecord.id }
                    });
                }
                break;

            case 'rdo':
                if (fieldName === 'media') {
                    // For RDO, we need to create a many-to-many relationship
                    updateResult = await prisma.rDO.update({
                        where: { id: recordId },
                        data: {
                            media: {
                                connect: { id: fileRecord.id }
                            }
                        }
                    });
                }
                break;

            case 'incident':
                if (fieldName === 'media') {
                    // For Incident, we need to create a many-to-many relationship
                    updateResult = await prisma.incident.update({
                        where: { id: recordId },
                        data: {
                            media: {
                                connect: { id: fileRecord.id }
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
            data: {
                fileId: fileRecord.id,
                url: fileRecord.url,
                publicId: fileRecord.publicId || '',
                name: fileRecord.name,
                format: fileRecord.format || '',
                size: fileRecord.size || 0,
                mimeType: fileRecord.mimeType || ''
            }
        };

    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while uploading file'
        };
    }
}

/**
 * Uploads multiple files to Cloudinary
 */
export async function uploadMultipleFilesToCloudinary(
    files: File[],
    tableName: string,
    recordId: number,
    fieldName: string,
    folder?: string
): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
        return [];
    }

    const uploadPromises = files.map(file =>
        uploadFileToCloudinary({
            file,
            tableName,
            recordId,
            fieldName,
            folder
        })
    );

    return Promise.all(uploadPromises);
}

/**
 * Deletes a file from Cloudinary and removes the File record from Prisma
 */
export async function deleteFileFromCloudinary(fileId: number): Promise<{ success: boolean; error?: string }> {
    try {
        // Get the file record from Prisma
        const fileRecord = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!fileRecord) {
            return {
                success: false,
                error: 'File record not found'
            };
        }

        // Extract public_id from URL (you might want to store this separately in the future)
        const urlParts = fileRecord.url.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Delete from Prisma
        await prisma.file.delete({
            where: { id: fileId }
        });

        return { success: true };

    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while deleting file'
        };
    }
} 