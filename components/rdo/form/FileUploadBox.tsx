"use client";
import { useRef } from 'react';

export function FileUploadBox({ onFiles }: { onFiles: (files: File[]) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Subir Fotos, Vídeos e documentos</label>
            <span className="block text-xs text-muted-foreground mb-2">Adicione fotos e vídeos no seu posta para atualizar a Obra</span>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer">
                <span className="text-3xl text-gray-400">+</span>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={e => {
                        if (e.target.files) onFiles(Array.from(e.target.files));
                    }}
                />
            </label>
        </div>
    );
} 