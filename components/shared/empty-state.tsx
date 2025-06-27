'use client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface EmptyStateProps {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
}

export function EmptyState({ title, description, buttonLabel, buttonHref }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground text-lg mb-2">
                {title}
            </div>
            <p className="text-sm text-muted-foreground/70 mb-4">
                {description}
            </p>
            <Link href={buttonHref}>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    {buttonLabel}
                </Button>
            </Link>
        </div>
    );
} 