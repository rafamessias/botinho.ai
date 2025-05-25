import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ProjectFormValues {
    projectName: string;
    projectDescription: string;
    projectAddress: string;
    projectPhoto?: FileList;
}

export function UploadPhoto({ register, photoUrl }: { register: UseFormRegister<ProjectFormValues>, photoUrl: string }) {
    const [previewUrl, setPreviewUrl] = useState<string>(photoUrl);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <span className="font-semibold text-base">Subir Foto</span>
            <span className="text-xs text-muted-foreground">Adicione uma foto (550px x 158px) para representar o Projeto </span>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('projectPhoto')}
                onChange={handleFileChange}
            />

            <div
                className="relative w-full h-40 rounded-xl overflow-hidden border border-dashed border-gray-300 mt-2 cursor-pointer bg-gray-100"
                onClick={() => {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                    input?.click();
                }}
            >
                {previewUrl ? (
                    <Image src={previewUrl} alt="Foto do Projeto" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Clique para adicionar uma foto
                    </div>
                )}
                {previewUrl && (
                    <button
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl('');
                        }}
                    >
                        <Trash2 className="h-5 w-5 text-primary" />
                    </button>
                )}
            </div>
        </div>
    );
}