"use client";
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';

export function LaborTextarea({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const t = useTranslations('form.labor');

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{t('label')}</label>
            <span className="block text-xs text-muted-foreground mb-2">{t('hint')}</span>
            <Textarea
                placeholder={t('placeholder')}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
} 