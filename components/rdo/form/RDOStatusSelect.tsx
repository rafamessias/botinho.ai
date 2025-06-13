"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RDOStatusSelect({ value, onChange, statuses }: {
    value: string, onChange: (v: string) => void, statuses: { value: string, label: string }[]
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Status do RDO</label>
            <span className="block text-xs text-muted-foreground mb-2">Modifique o Status do RDO aqui</span>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 