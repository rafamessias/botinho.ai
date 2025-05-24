import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function UploadPhoto({ photoUrl }: { photoUrl: string }) {
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
            <span className="text-xs text-muted-foreground">Adicione uma foto para representar o Projeto</span>
            <div
                className="relative w-full h-40 rounded-xl overflow-hidden border border-dashed border-gray-300 mt-2 cursor-pointer"
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.style.display = 'none';
                    document.body.appendChild(input);
                    input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setPreviewUrl(imageUrl);
                        }
                    };
                    input.click();
                    document.body.removeChild(input);
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