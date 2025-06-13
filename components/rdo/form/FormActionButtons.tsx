"use client";
import { Button } from '@/components/ui/button';

export function FormActionButtons({ onCancel, isSubmitting }: { onCancel: () => void, isSubmitting: boolean }) {
    return (
        <div className="flex gap-2 mt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>Enviar</Button>
        </div>
    );
} 