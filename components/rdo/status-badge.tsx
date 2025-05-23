import { Badge } from '@/components/ui/badge';
import { CloudMoon, CloudRain, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    label: string;
    type?: 'default' | 'warning' | 'danger';
}

export function StatusBadge({ label, type }: StatusBadgeProps) {
    const color =
        type === 'danger'
            ? 'bg-red-100 text-red-700'
            : type === 'warning'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700';
    const icon =
        type === 'danger' ? <CloudRain className="ml-1 h-4 w-4 inline" /> :
            type === 'warning' ? <CloudMoon className="ml-1 h-4 w-4 inline" /> :
                <Sun className="ml-1 h-4 w-4 inline" />;
    return (
        <Badge className={cn('px-3 py-1 text-sm font-medium', color)}>
            {label} {icon}
        </Badge>
    );
} 