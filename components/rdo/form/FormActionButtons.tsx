"use client";
import { Button } from '@/components/ui/button';

export function FormActionButtons({ onCancel, isSubmitting }: { onCancel: () => void, isSubmitting: boolean }) {
    return (
        <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>Enviar</Button>
        </div>
    );
} 