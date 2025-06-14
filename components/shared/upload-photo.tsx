import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { UseFormRegister, FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { ConfirmDialog } from './confirm-dialog';
import { useTranslations } from 'next-intl';

interface UploadPhotoProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    name: Path<T>;
    photoUrl?: string;
    label: string;
    hint?: string;
    onChange?: (file: File | File[] | null) => void;
    type?: 'logo' | 'photo' | 'carousel';
    currentImage?: string;
    initialFiles?: (string | File | StrapiFiles)[];
    onRemoveImage?: (fileOrUrl: string | File) => void;
}

interface StrapiFiles {
    alternativeText: string | null;
    caption: string | null;
    createdAt: string;
    documentId: string;
    ext: string;
    formats: {
        small: {
            url: string;
        };
        medium: {
            url: string;
        };
        thumbnail: {
            url: string;
        };
        large: {
            url: string;
        };
        hash: string;
        height: number;
        id: number;
        mime: string;
        name: string;
        previewUrl: string | null;
        provider: string;
        provider_metadata: {
            public_id: string;
            resource_type: string;
        };
        publishedAt: string;
        size: number;
        updatedAt: string;
        url: string;
        width: number;
    };
    url: string;
}

export function UploadPhoto<T extends FieldValues>({
    register,
    setValue,
    name,
    photoUrl = '',
    label,
    hint,
    onChange,
    type = 'photo',
    currentImage = '',
    initialFiles = [],
    onRemoveImage,
}: UploadPhotoProps<T>) {
    const t = useTranslations('uploadPhoto');
    const [previewUrls, setPreviewUrls] = useState<string[]>(currentImage ? [currentImage] : []);
    const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingRemove, setPendingRemove] = useState<{ fileOrUrl: string | File; index?: number } | null>(null);

    //console.log('initialFiles', initialFiles);

    useEffect(() => {
        // If initialFiles are provided, set them as previews
        if (initialFiles.length > 0) {
            const urls = initialFiles.map(file => {
                if (typeof file === 'string') return file;
                if ((file as StrapiFiles)?.url) return (file as StrapiFiles).url;
                return URL.createObjectURL(file as File);
            });
            setPreviewUrls(urls);
            setCarouselFiles(initialFiles.filter(f => f instanceof File) as File[]);
        }
    }, [initialFiles]);

    const isCarousel = type === 'carousel';
    const isLogo = type === 'logo';
    const isPhoto = type === 'photo';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (isCarousel) {
            const fileArr = Array.from(files);
            const urls = fileArr.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
            setCarouselFiles(prev => [...prev, ...fileArr]);
            setCarouselIndex(prev => prev);
            setValue(name, fileArr as any);
            onChange?.([...carouselFiles, ...fileArr]);
        } else {
            const file = files[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setPreviewUrls([imageUrl]);
                setCarouselFiles([file]);
                setCarouselIndex(0);
                setValue(name, files as any);
                onChange?.(file);
            }
        }
    };

    const openRemoveDialog = (e: React.MouseEvent, index?: number) => {
        e.stopPropagation();
        let fileOrUrl: string | File;
        if (isCarousel && typeof index === 'number') {
            const file = initialFiles[index];
            if (typeof file === 'string') fileOrUrl = file;
            else if ((file as StrapiFiles)?.url) fileOrUrl = (file as StrapiFiles).url;
            else fileOrUrl = file as File;
        } else {
            const file = initialFiles[0];
            if (typeof file === 'string') fileOrUrl = file;
            else if ((file as StrapiFiles)?.url) fileOrUrl = (file as StrapiFiles).url;
            else fileOrUrl = file as File;
        }
        setPendingRemove({ fileOrUrl, index });
        setDialogOpen(true);
    };

    const confirmRemove = () => {
        if (!pendingRemove) return;
        const { fileOrUrl, index } = pendingRemove;
        if (onRemoveImage) {
            onRemoveImage(fileOrUrl);
        }
        // Remove from local state as well
        if (isCarousel && typeof index === 'number') {
            const newPreviews = previewUrls.filter((_, i) => i !== index);
            const newFiles = carouselFiles.filter((_, i) => i !== index);
            setPreviewUrls(newPreviews);
            setCarouselFiles(newFiles);
            setCarouselIndex(0);
            if (inputRef.current) inputRef.current.value = '';
            setValue(name, newFiles as any);
            onChange?.(newFiles.length ? newFiles : null);
        } else {
            setPreviewUrls([]);
            setCarouselFiles([]);
            setCarouselIndex(0);
            if (inputRef.current) inputRef.current.value = '';
            setValue(name, undefined as any);
            onChange?.(null);
        }
        setDialogOpen(false);
        setPendingRemove(null);
    };

    const cancelRemove = () => {
        setDialogOpen(false);
        setPendingRemove(null);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCarouselIndex((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCarouselIndex((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1));
    };

    const containerClass = isLogo
        ? 'flex flex-col items-start gap-2'
        : 'w-full flex flex-col gap-2';
    const previewClass = isLogo
        ? 'relative w-[160px] h-[160px] rounded-xl overflow-hidden border border-dashed border-gray-300 mt-2 cursor-pointer bg-gray-100'
        : 'relative w-full h-40 rounded-xl overflow-hidden border border-dashed border-gray-300 mt-2 cursor-pointer bg-gray-100';

    return (
        <div className={containerClass}>
            <span className="font-semibold text-base">{label}</span>
            {hint && <span className="text-xs text-muted-foreground">{hint}</span>}

            <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                {...register(name)}
                ref={inputRef}
                onChange={handleFileChange}
                multiple={isCarousel}
            />

            <div
                className={previewClass}
                onClick={() => inputRef.current?.click()}
            >
                {isCarousel ? (
                    previewUrls.length > 0 ? (
                        <>
                            <Image src={previewUrls[carouselIndex]} alt={label} fill className="object-cover" />
                            {previewUrls.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow"
                                        onClick={handlePrev}
                                        type="button"
                                    >
                                        {'<'}
                                    </button>
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow"
                                        onClick={handleNext}
                                        type="button"
                                    >
                                        {'>'}
                                    </button>
                                </>
                            )}
                            <button
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-md"
                                onClick={e => openRemoveDialog(e, carouselIndex)}
                                type="button"
                            >
                                <Trash2 className="h-5 w-5 text-primary" />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            {isCarousel ? t('clickToAdd') : isLogo ? t('clickToAddLogo') : t('clickToAddPhoto')}
                        </div>
                    )
                ) : previewUrls.length > 0 ? (
                    <>
                        <Image src={previewUrls[0]} alt={label} fill className="object-cover" />
                        <button
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-md"
                            onClick={openRemoveDialog}
                            type="button"
                        >
                            <Trash2 className="h-5 w-5 text-primary" />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        {isCarousel ? t('clickToAdd') : isLogo ? t('clickToAddLogo') : t('clickToAddPhoto')}
                    </div>
                )}
            </div>
            {isCarousel && previewUrls.length > 0 && (
                <div className="text-center text-sm text-muted-foreground mt-1">
                    {carouselIndex + 1} / {previewUrls.length}
                </div>
            )}
            {isCarousel && previewUrls.length > 0 && (
                <div className="flex justify-end relative">
                    <button
                        type="button"
                        className="absolute right-0 -top-10 mt-2 text-sm py-1 px-2 rounded-lg border border-gray-300 text-blue-700"
                        onClick={() => inputRef.current?.click()}
                    >
                        {t('clickToAdd')}
                    </button>
                </div>
            )}
            <ConfirmDialog
                open={dialogOpen}
                onConfirm={confirmRemove}
                onCancel={cancelRemove}
                title={t('removeImage.title')}
                description={t('removeImage.description')}
                confirmLabel={t('removeImage.confirm')}
                cancelLabel={t('removeImage.cancel')}
                confirmVariant="primary"
            />
        </div>
    );
} 