"use client";
import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/components/types/strapi";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
    className?: string;
    showIcon?: boolean;
}

export function ProjectStatusBadge({ status, className, showIcon = false }: ProjectStatusBadgeProps) {
    const t = useTranslations('project.status');

    const getStatusLabel = (status: ProjectStatus) => {
        switch (status) {
            case 'active':
                return t('active');
            case 'wip':
                return t('wip');
            case 'finished':
                return t('finished');
            case 'stopped':
                return t('stopped');
            case 'deactivated':
                return t('deactivated');
            default:
                return status;
        }
    };

    const getStatusVariant = (status: ProjectStatus) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'wip':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'finished':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'stopped':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'deactivated':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border",
                getStatusVariant(status),
                className
            )}
        >
            {showIcon && (
                <span className={cn("w-2 h-2 rounded-full mr-1", getStatusVariant(status).replace('bg-', '').replace(' text-', '').replace(' border-', ''))} />
            )}
            {getStatusLabel(status)}
        </Badge>
    );
} 