// Compression settings
export const COMPRESSION_SETTINGS = {
    images: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'webp' as const,
    },
    videos: {
        maxWidth: 1280,
        maxHeight: 720,
        quality: 0.7,
        format: 'mp4' as const,
    },
    documents: {
        // Documents are typically not compressed
        maxSize: 10 * 1024 * 1024, // 10MB
    }
};

// Image compression using Canvas API
export async function compressImage(file: File, settings = COMPRESSION_SETTINGS.images): Promise<File> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;
            const { maxWidth, maxHeight } = settings;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                'image/webp',
                settings.quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

// Video compression using MediaRecorder API
export async function compressVideo(file: File, settings = COMPRESSION_SETTINGS.videos): Promise<File> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        video.onloadedmetadata = () => {
            // Calculate new dimensions
            let { videoWidth, videoHeight } = video;
            const { maxWidth, maxHeight } = settings;

            if (videoWidth > maxWidth) {
                videoHeight = (videoHeight * maxWidth) / videoWidth;
                videoWidth = maxWidth;
            }

            if (videoHeight > maxHeight) {
                videoWidth = (videoWidth * maxHeight) / videoHeight;
                videoHeight = maxHeight;
            }

            canvas.width = videoWidth;
            canvas.height = videoHeight;

            // Set up MediaRecorder
            const stream = canvas.captureStream();
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
            });

            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.mp4'), {
                    type: 'video/mp4',
                    lastModified: Date.now(),
                });
                resolve(compressedFile);
            };

            // Start recording
            video.play();
            mediaRecorder.start();

            // Draw frames
            const drawFrame = () => {
                if (video.ended || video.paused) {
                    mediaRecorder.stop();
                    return;
                }

                ctx?.drawImage(video, 0, 0, videoWidth, videoHeight);
                requestAnimationFrame(drawFrame);
            };

            drawFrame();
        };

        video.onerror = () => reject(new Error('Failed to load video'));
        video.src = URL.createObjectURL(file);
    });
}

// Main compression function
export async function compressFile(file: File): Promise<File> {
    const fileType = file.type.split('/')[0];

    try {
        switch (fileType) {
            case 'image':
                return await compressImage(file);
            case 'video':
                return await compressVideo(file);
            case 'application':
                // For PDFs and other documents, return as-is without compression
                if (file.type === 'application/pdf' ||
                    file.type.startsWith('application/')) {
                    return file;
                }
            // Fall through to default for other application types
            default:
                // For documents, check size and return as-is if under limit
                if (file.size <= COMPRESSION_SETTINGS.documents.maxSize) {
                    return file;
                }
                throw new Error('Document too large');
        }
    } catch (error) {
        console.warn('Compression failed, using original file:', error);
        return file;
    }
}

// Batch compression
export async function compressFiles(files: File[]): Promise<File[]> {
    const compressedFiles = await Promise.all(
        files.map(file => compressFile(file))
    );

    return compressedFiles;
}
