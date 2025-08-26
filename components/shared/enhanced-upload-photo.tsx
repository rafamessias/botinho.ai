"use client";

import { useState, useRef, useEffect } from 'react';
import { UseFormRegister, FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { compressFiles } from '@/lib/compression';
import { FileImage } from '@/components/types/prisma';
import { Trash2, Upload, Image as ImageIcon, Video, File as FileIcon, Edit3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EnhancedUploadPhotoProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    name: Path<T>;
    label: string;
    hint?: string;
    onChange?: (files: File[]) => void;
    type?: 'logo' | 'photo' | 'carousel' | 'banner';
    initialFiles?: (string | File | FileImage)[];
    onRemoveImage?: (fileOrUrl: string | File | FileImage | number) => void;
    maxFiles?: number;
    maxFileSize?: number; // in MB
}

export function EnhancedUploadPhoto<T extends FieldValues>({
    register,
    setValue,
    name,
    label,
    hint,
    onChange,
    type = 'photo',
    initialFiles = [],
    onRemoveImage,
    maxFiles = 10,
    maxFileSize = 50
}: EnhancedUploadPhotoProps<T>) {
    const t = useTranslations('enhancedUpload');
    const [files, setFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<(string | File | FileImage)[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const processedInitialFilesRef = useRef<string>('');

    useEffect(() => {
        // Prevent processing if initialFiles is undefined or null
        if (!initialFiles) {
            return;
        }

        // Create a hash of current initialFiles to check if they've actually changed
        const currentInitialFilesHash = JSON.stringify(initialFiles.map(f =>
            typeof f === 'string' ? f : (f as FileImage)?.id || (f as File)?.name
        ));

        // Skip if we've already processed these exact initialFiles
        if (processedInitialFilesRef.current === currentInitialFilesHash) {
            return;
        }

        // Clean up any existing blob URLs before updating
        previewUrls.forEach(url => {
            if (url && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });

        // Handle initial files
        if (initialFiles.length > 0) {
            const urls = initialFiles.map(file => {
                if (typeof file === 'string') return file;
                if ((file as FileImage)?.url) return (file as FileImage).url;
                if (file instanceof File) return URL.createObjectURL(file);
                return '';
            }).filter(url => url !== '');

            setExistingFiles(initialFiles);
            setPreviewUrls(urls);
            setFiles([]); // Clear new files when initial files change
        } else {
            // Only clear states when initialFiles is empty
            setExistingFiles([]);
            setPreviewUrls([]);
            setFiles([]);
        }

        // Mark these initialFiles as processed
        processedInitialFilesRef.current = currentInitialFilesHash;
    }, [initialFiles]);

    // Cleanup effect to revoke object URLs when component unmounts
    useEffect(() => {
        return () => {
            // Clean up all preview URLs when component unmounts
            previewUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewUrls]);

    const validateFile = (file: File): string | null => {
        const maxSizeBytes = maxFileSize * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            return `${t('fileSizeError', { maxFileSize })}`;
        }

        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/mov', 'video/avi',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            return t('fileTypeError');
        }

        return null;
    };

    const handleFileSelect = async (selectedFiles: FileList | null, isEditMode: boolean = false) => {
        if (!selectedFiles) return;

        const fileArray = Array.from(selectedFiles);

        // Validate files
        for (const file of fileArray) {
            const error = validateFile(file);
            if (error) {
                toast.error(error);
                return;
            }
        }

        // If in edit mode, clear existing files first
        if (isEditMode) {
            // Clear existing files and previews
            setFiles([]);
            setExistingFiles([]);
            setPreviewUrls([]);

            // Clean up existing preview URLs
            previewUrls.forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        } else {
            // Check max files limit for normal mode
            if (files.length + existingFiles.length + fileArray.length > maxFiles) {
                toast.error(t('maxFilesError', { maxFiles }));
                return;
            }
        }

        setIsCompressing(true);

        try {
            // Compress files
            const compressedFiles = await compressFiles(fileArray);

            // Create preview URLs for new files
            const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));

            if (isEditMode) {
                // In edit mode, replace all files
                setFiles(compressedFiles);
                setPreviewUrls(newPreviewUrls);
                setValue(name, compressedFiles as any);
                onChange?.(compressedFiles);
            } else {
                // In normal mode, add new files to existing ones
                const updatedFiles = [...files, ...compressedFiles];
                const updatedPreviewUrls = [...previewUrls, ...newPreviewUrls];

                setFiles(updatedFiles);
                setPreviewUrls(updatedPreviewUrls);

                // Update form value with all files (existing + new)
                setValue(name, updatedFiles as any);
                onChange?.(updatedFiles);
            }

            toast.success(t('filesProcessedSuccess', { count: compressedFiles.length }));
        } catch (error) {
            console.error('Error processing files:', error);
            toast.error(t('processFilesError'));
        } finally {
            setIsCompressing(false);
        }
    };

    const removeFile = (index: number) => {
        const totalFiles = [...existingFiles, ...files];
        const fileToRemove = totalFiles[index];

        if (index < existingFiles.length) {
            // Removing an existing file
            const newExistingFiles = existingFiles.filter((_, i) => i !== index);
            const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

            setExistingFiles(newExistingFiles);
            setPreviewUrls(newPreviewUrls);

            // Call onRemoveImage for existing files - pass the index for FileImage objects
            if (typeof fileToRemove === 'string') {
                onRemoveImage?.(fileToRemove);
            } else if ((fileToRemove as FileImage)?.id) {
                onRemoveImage?.(fileToRemove as FileImage);
            } else if (fileToRemove instanceof File) {
                onRemoveImage?.(fileToRemove);
            } else {
                // Handle FileImage without id
                onRemoveImage?.(fileToRemove as FileImage);
            }
        } else {
            // Removing a new file
            const newFileIndex = index - existingFiles.length;
            const newFiles = files.filter((_, i) => i !== newFileIndex);
            const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

            setFiles(newFiles);
            setPreviewUrls(newPreviewUrls);

            // Clean up preview URL
            if (previewUrls[index]) {
                URL.revokeObjectURL(previewUrls[index]);
            }

            // Update form value - only set the remaining new File objects
            setValue(name, newFiles as any);
            onChange?.(newFiles);
        }
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
        if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
        return <FileIcon className="w-4 h-4" />;
    };

    const getPreviewSize = () => {
        switch (type) {
            case 'logo':
                return 'w-[150px] h-[150px]';
            case 'photo':
                return 'w-[150px] h-[150px]'; // 150x150px for profile photos
            case 'banner':
                return 'w-full h-64';
            default:
                return 'w-[150px] h-[150px]'; // Default to profile photo size
        }
    };

    const getPreviewContainerSize = () => {
        switch (type) {
            case 'logo':
                return 'w-[150px] h-[150px]';
            case 'photo':
                return 'w-[150px] h-[150px]'; // Container for profile photos
            case 'banner':
                return 'w-full max-w-2xl';
            default:
                return 'w-[150px] h-[150px]'; // Default to profile photo container
        }
    };

    const renderSingleImagePreview = (fileOrUrl: string | File | FileImage, index: number) => {
        const previewUrl = previewUrls[index];
        const isExistingFile = index < existingFiles.length;
        const file = isExistingFile ? fileOrUrl : fileOrUrl as File;

        // Determine file name
        let fileName = 'Unknown file';
        if (typeof file === 'string') {
            fileName = file.split('/').pop() || 'Image';
        } else if (file instanceof File) {
            fileName = file.name;
        } else if ((file as FileImage)?.name) {
            fileName = (file as FileImage).name;
        }

        return (
            <div className="flex flex-col items-center">
                <div className={`${getPreviewContainerSize()} relative`}>
                    <div className={`${getPreviewSize()} overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50`}>
                        <img
                            src={previewUrl}
                            alt={t('preview', { index: index + 1 })}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Always visible buttons positioned to avoid photo overlap */}
                    <div className="absolute -top-3 -right-3 flex gap-1">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                // Trigger file selection in edit mode
                                const input = fileInputRef.current;
                                if (input) {
                                    const originalOnChange = input.onchange;
                                    input.onchange = (e) => {
                                        const target = e.target as HTMLInputElement;
                                        handleFileSelect(target.files, true);
                                        // Reset the input value and restore original onChange
                                        input.value = '';
                                        input.onchange = originalOnChange;
                                    };
                                    input.click();
                                }
                            }}
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-sm border border-gray-200"
                        >
                            <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500 text-white shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderFilePlaceholder = (fileOrUrl: string | File | FileImage, index: number) => {
        // Determine if this is an existing file or a new file
        const isExistingFile = index < existingFiles.length;
        const file = isExistingFile ? fileOrUrl : fileOrUrl as File;

        // Get the preview URL
        const previewUrl = previewUrls[index];

        // Determine file type and name
        let fileType = 'unknown';
        let fileName = 'Unknown file';

        if (typeof file === 'string') {
            fileType = 'image';
            fileName = file.split('/').pop() || 'Image';
        } else if (file instanceof File) {
            const fileObj = file as File;
            if (fileObj.type.startsWith('image/')) fileType = 'image';
            else if (fileObj.type.startsWith('video/')) fileType = 'video';
            else fileType = 'document';
            fileName = fileObj.name;
        } else if ((file as FileImage)?.mimeType) {
            // Handle FileImage with mimeType property
            const mimeType = (file as FileImage).mimeType;
            if (mimeType?.startsWith('image/')) fileType = 'image';
            else if (mimeType?.startsWith('video/')) fileType = 'video';
            else fileType = 'document';
            fileName = (file as FileImage).name || 'File';
        } else if ((file as FileImage)?.url) {
            // Handle FileImage without mimeType - try to determine from format or fallback to image
            const fileImage = file as FileImage;
            const format = fileImage.format?.toLowerCase();
            if (format && ['mp4', 'mov', 'avi', 'webm'].includes(format)) {
                fileType = 'video';
            } else if (format && ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(format)) {
                fileType = 'document';
            } else {
                fileType = 'image'; // Default fallback
            }
            fileName = fileImage.name || 'File';
        } else {
            // Handle FileImage objects that don't have mimeType property
            fileType = 'image';
            fileName = (file as FileImage)?.name || 'Image';
        }

        if (fileType === 'image') {
            return (
                <div key={index} className="relative">
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt={t('preview', { index: index + 1 })}
                            className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-xs text-gray-700 font-medium truncate" title={fileName}>
                            {truncateFileName(fileName)}
                        </p>
                        {file instanceof File && file.size && (
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        )}
                        {(file as FileImage)?.size && (
                            <p className="text-xs text-gray-500">{formatFileSize((file as FileImage).size!)}</p>
                        )}
                    </div>
                </div>
            );
        }

        if (fileType === 'video') {
            return (
                <div key={index} className="relative">
                    <div className="relative">
                        <div className="w-full h-24 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <Video className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                                <p className="text-xs text-blue-700 font-medium">{t('videoFile')}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-xs text-gray-700 font-medium truncate" title={fileName}>
                            {truncateFileName(fileName)}
                        </p>
                        {file instanceof File && file.size && (
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        )}
                        {(file as FileImage)?.size && (
                            <p className="text-xs text-gray-500">{formatFileSize((file as FileImage).size!)}</p>
                        )}
                    </div>
                </div>
            );
        }

        // For documents and other files
        return (
            <div key={index} className="relative">
                <div className="relative">
                    <div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <FileIcon className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-700 font-medium">{t('documentFile')}</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-xs text-gray-700 font-medium truncate" title={fileName}>
                        {truncateFileName(fileName)}
                    </p>
                    {file instanceof File && file.size && (
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    )}
                    {(file as FileImage)?.size && (
                        <p className="text-xs text-gray-500">{formatFileSize((file as FileImage).size!)}</p>
                    )}
                </div>
            </div>
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const truncateFileName = (fileName: string, maxLength: number = 20) => {
        if (fileName.length <= maxLength) return fileName;

        const extension = fileName.split('.').pop();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));

        if (!extension || nameWithoutExt.length <= 3) return fileName;

        const charsToKeep = maxLength - extension.length - 3; // 3 for "..."
        const start = Math.ceil(charsToKeep / 2);
        const end = nameWithoutExt.length - Math.floor(charsToKeep / 2);

        return `${nameWithoutExt.substring(0, start)}...${nameWithoutExt.substring(end)}.${extension}`;
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleFileSelect(e.dataTransfer.files, false);
        }
    };

    // Combine existing and new files for display
    const allFiles = [...existingFiles, ...files];

    // Check if this is a single file upload (not carousel)
    const isSingleFileUpload = type !== 'carousel' && maxFiles === 1;
    const hasSingleImage = isSingleFileUpload && allFiles.length === 1;

    // Check if we should show single image preview
    const shouldShowSingleImagePreview = hasSingleImage && (() => {
        const firstFile = allFiles[0];
        return typeof firstFile === 'string' ||
            (firstFile instanceof File && firstFile.type.startsWith('image/')) ||
            ((firstFile as FileImage)?.mimeType && (firstFile as FileImage).mimeType?.startsWith('image/')) ||
            ((firstFile as FileImage)?.url && !(firstFile as FileImage).format);
    })();

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium">{label}</label>
                {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
            </div>

            {/* Hidden file input - always present */}
            <input
                {...register(name)}
                ref={fileInputRef}
                type="file"
                multiple={type === 'carousel'}
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => handleFileSelect(e.target.files, false)}
                className="hidden"
            />

            {/* Single Image Preview */}
            {shouldShowSingleImagePreview ? (
                <div className="flex ">
                    {renderSingleImagePreview(allFiles[0], 0)}
                </div>
            ) : (
                <>
                    {/* File Input */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className={`mx-auto h-12 w-12 transition-colors ${isDragOver ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                        <p className="mt-2 text-sm text-gray-600">
                            {isDragOver ? t('dragOverMessage') : t('uploadHint')}
                        </p>
                        <p className="text-xs text-gray-500">
                            {t('fileLimits', { maxFiles, maxFileSize })}
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isCompressing || isUploading}
                            className="mt-4"
                        >
                            {isCompressing ? t('compressing') : t('selectFiles')}
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    {(isCompressing || isUploading) && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{isCompressing ? t('compressingFiles') : t('uploadingFiles')}</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="w-full" />
                        </div>
                    )}

                    {/* Preview Grid */}
                    {allFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {allFiles.map((fileOrUrl, index) => renderFilePlaceholder(fileOrUrl, index))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
