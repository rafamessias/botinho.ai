"use client";
import { Textarea } from '@/components/ui/textarea';

export function EquipmentTextarea({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Equipamentos Utilizados</label>
            <span className="block text-xs text-muted-foreground mb-2">Adicione os equipamentos utilizados</span>
            <Textarea
                placeholder="Executamos a seguinte parte da obra..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
} 