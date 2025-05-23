import { Trash2 } from 'lucide-react';
import Image from 'next/image';

export function UploadPhoto({ photoUrl }: { photoUrl: string }) {
    return (
        <div className="w-full flex flex-col gap-2">
            <span className="font-semibold text-base">Subir Foto</span>
            <span className="text-xs text-muted-foreground">Adicione uma foto para representar o Projeto</span>
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-dashed border-gray-300 mt-2">
                <Image src={photoUrl} alt="Foto do Projeto" fill className="object-cover" />
                <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                    <Trash2 className="h-5 w-5 text-primary" />
                </button>
            </div>
        </div>
    );
} 