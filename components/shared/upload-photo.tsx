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
    onChange?: (file: File | null) => void;
}

export function UploadPhoto<T extends FieldValues>({
    register,
    setValue,
    name,
    photoUrl = '',
    label,
    hint,
    onChange,
}: UploadPhotoProps<T>) {
    const [previewUrl, setPreviewUrl] = useState<string>(photoUrl);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setValue(name, e.target.files as any); // Ensure react-hook-form tracks the file
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
            onChange?.(file);
        } else {
            setPreviewUrl('');
            onChange?.(null);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl('');
        if (inputRef.current) inputRef.current.value = '';
        setValue(name, undefined as any); // Remove file from react-hook-form
        onChange?.(null);
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <span className="font-semibold text-base">{label}</span>
            {hint && <span className="text-xs text-muted-foreground">{hint}</span>}

            <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register(name)}
                ref={inputRef}
                onChange={handleFileChange}
            />

            <div
                className="relative w-full h-40 rounded-xl overflow-hidden border border-dashed border-gray-300 mt-2 cursor-pointer bg-gray-100"
                onClick={() => inputRef.current?.click()}
            >
                {previewUrl ? (
                    <Image src={previewUrl} alt={label} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Click to add a photo
                    </div>
                )}
                {previewUrl && (
                    <button
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-md"
                        onClick={handleRemove}
                        type="button"
                    >
                        <Trash2 className="h-5 w-5 text-primary" />
                    </button>
                )}
            </div>
        </div>
    );
} 