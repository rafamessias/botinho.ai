'use client';

import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Shield, FileText, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { User } from './add-user-dialog';
import { ConfirmDialog } from './confirm-dialog';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserItemProps extends User {
    onEdit?: (user: User) => void;
    onRemove?: () => void;
    disabled?: boolean;
}

export function UserItem({ name, email, phone, isAdmin, canPost, canApprove, onEdit, onRemove, disabled }: UserItemProps) {
    const t = useTranslations('shared.user');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleRemove = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmRemove = () => {
        onRemove?.();
        setShowConfirmDialog(false);
    };

    return (
        <>
            <div className={`inline-flex items-center gap-2 mb-5 mr-2 px-3 py-1.5 rounded-full ${disabled ? 'bg-slate-100' : 'bg-slate-50'} border border-slate-200 relative`}>
                <span className="text-sm font-medium">{name}</span>
                <div className="flex gap-1 ml-1">
                    {onEdit && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-slate-200"
                            onClick={() => onEdit({ name, email, phone, isAdmin, canPost, canApprove })}
                            title={t('edit')}
                            disabled={disabled}
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                    )}
                    {onRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-slate-200"
                            onClick={handleRemove}
                            title={t('remove')}
                            disabled={disabled}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <div className="flex gap-1 absolute -bottom-4 left-1 transform ">
                    <TooltipProvider>
                        {isAdmin && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="h-6 w-6 flex items-center justify-center text-blue-600 bg-white rounded-full border border-slate-200 shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Shield className="h-3 w-3" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('permissions.isAdmin')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {canPost && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="h-6 w-6 flex items-center justify-center text-green-600 bg-white rounded-full border border-slate-200 shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FileText className="h-3 w-3" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('permissions.canPost')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {canApprove && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="h-6 w-6 flex items-center justify-center text-purple-600 bg-white rounded-full border border-slate-200 shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('permissions.canApprove')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onConfirm={handleConfirmRemove}
                onCancel={() => setShowConfirmDialog(false)}
                title={t('removeConfirm.title')}
                description={t('removeConfirm.description', { name })}
                confirmLabel={t('removeConfirm.confirm')}
                cancelLabel={t('removeConfirm.cancel')}
                confirmVariant="primary"
            />
        </>
    );
} 