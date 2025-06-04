'use client';
import { SearchX, ArrowLeftCircle } from 'lucide-react';
import { Button } from './button';

interface RecordNotFoundProps {
    message?: string;
    buttonLabel?: string;
}

export function RecordNotFound({
    message = 'Registro não encontrado',
    buttonLabel = 'Voltar',
}: RecordNotFoundProps) {
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
            <SearchX className="w-16 h-16 text-gray-400 mb-2" />
            <div className="text-xl font-semibold text-gray-700 mb-2">{message}</div>
            <Button onClick={handleBack} variant="outline" className="w-full max-w-[200px] px-4 py-2 flex items-center justify-center">
                <ArrowLeftCircle className="w-4 h-4 mr-2" />
                {buttonLabel}
            </Button>
        </div>
    );
} 