"use client";
import { Textarea } from '@/components/ui/textarea';

export function LaborTextarea({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Mão de Obra</label>
            <span className="block text-xs text-muted-foreground mb-2">Adicione a mão de obra utilizada</span>
            <Textarea
                placeholder="Executamos a seguinte parte da obra..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
} 