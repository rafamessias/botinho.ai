import { compressFiles } from './compression';

export interface UploadResult {
    success: boolean;
    data?: {
        publicId: string;
        url: string;
        format: string;
        size: number;
        name: string;
    };
    error?: string;
}

export interface SignedUploadParams {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
    resourceType: string;
}

export async function getSignedUploadParams(folder = 'obraguru', resourceType = 'auto'): Promise<SignedUploadParams> {
    const response = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder, resourceType }),
    });

    if (!response.ok) {
        throw new Error('Failed to get upload parameters');
    }

    const data = await response.json();

    return data;
}

export async function uploadToCloudinary(
    files: File[],
    folder = 'obraguru',
    onProgress?: (progress: number) => void
): Promise<UploadResult[]> {
    try {
        // Compress files first
        const compressedFiles = await compressFiles(files);

        // Get signed upload parameters
        const uploadParams = await getSignedUploadParams(folder);

        const results: UploadResult[] = [];
        let completed = 0;

        // Upload files sequentially to avoid overwhelming the server
        for (const file of compressedFiles) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', uploadParams.folder);
                formData.append('timestamp', uploadParams.timestamp.toString());
                formData.append('signature', uploadParams.signature);
                formData.append('api_key', uploadParams.apiKey);
                formData.append('resource_type', uploadParams.resourceType);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${uploadParams.cloudName}/auto/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Upload error response:', errorText);
                    throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
                }

                const result = await response.json();

                results.push({
                    success: true,
                    data: {
                        publicId: result.public_id,
                        url: result.secure_url,
                        format: result.format,
                        size: result.bytes,
                        name: file.name,
                    },
                });
            } catch (error) {
                console.error('File upload error:', error);
                results.push({
                    success: false,
                    error: error instanceof Error ? error.message : 'Upload failed',
                });
            }

            completed++;
            onProgress?.(Math.round((completed / compressedFiles.length) * 100));
        }

        return results;
    } catch (error) {
        console.error('Upload error:', error);
        return [{
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        }];
    }
}
