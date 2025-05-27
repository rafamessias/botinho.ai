import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { UseFormRegister, FieldValues, Path, UseFormSetValue } from 'react-hook-form';

interface UploadPhotoProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    name: Path<T>;
    photoUrl?: string;
    label: string;
    hint?: string;
    onChange?: (file: File | File[] | null) => void;
    type?: 'logo' | 'photo' | 'carousel';
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
}: UploadPhotoProps<T>) {
    const [previewUrls, setPreviewUrls] = useState<string[]>(photoUrl ? [photoUrl] : []);
    const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const isCarousel = type === 'carousel';
    const isLogo = type === 'logo';
    const isPhoto = type === 'photo';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (isCarousel && files) {
            const fileArr = Array.from(files);
            const urls = fileArr.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
            setCarouselFiles(prev => [...prev, ...fileArr]);
            setCarouselIndex(prev => prev);
            setValue(name, [...carouselFiles, ...fileArr] as any);
            onChange?.([...carouselFiles, ...fileArr]);
        } else {
            const file = files?.[0];
            setValue(name, files as any);
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setPreviewUrls([imageUrl]);
                setCarouselFiles([file]);
                setCarouselIndex(0);
                onChange?.(file);
            } else {
                setPreviewUrls([]);
                setCarouselFiles([]);
                setCarouselIndex(0);
                onChange?.(null);
            }
        }
    };

    const handleRemove = (e: React.MouseEvent, index?: number) => {
        e.stopPropagation();
        if (isCarousel && typeof index === 'number') {
            const newPreviews = previewUrls.filter((_, i) => i !== index);
            const newFiles = carouselFiles.filter((_, i) => i !== index);
            setPreviewUrls(newPreviews);
            setCarouselFiles(newFiles);
            setCarouselIndex(0);
            if (inputRef.current) inputRef.current.value = '';
            setValue(name, undefined as any);
            onChange?.(newFiles.length ? newFiles : null);
        } else {
            setPreviewUrls([]);
            setCarouselFiles([]);
            setCarouselIndex(0);
            if (inputRef.current) inputRef.current.value = '';
            setValue(name, undefined as any);
            onChange?.(null);
        }
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
                                onClick={e => handleRemove(e, carouselIndex)}
                                type="button"
                            >
                                <Trash2 className="h-5 w-5 text-primary" />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Click to add photos or videos
                        </div>
                    )
                ) : previewUrls.length > 0 ? (
                    <>
                        <Image src={previewUrls[0]} alt={label} fill className="object-cover" />
                        <button
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-md"
                            onClick={handleRemove}
                            type="button"
                        >
                            <Trash2 className="h-5 w-5 text-primary" />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Click to add a {isLogo ? 'logo' : 'photo'}
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
                        Add more
                    </button>
                </div>
            )}
        </div>
    );
} 