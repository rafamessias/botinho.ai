"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';

export function RDOStatusSelect({ value, onChange, statuses }: {
    value: string, onChange: (v: string) => void, statuses: { value: string, label: string }[]
}) {
    const t = useTranslations('form.status');

    return (
        <div className="flex flex-col w-full">
            <label className="block text-sm font-medium mb-1">{t('label')}</label>
            <span className="block text-xs text-muted-foreground mb-2">{t('hint')}</span>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('placeholder')} />
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