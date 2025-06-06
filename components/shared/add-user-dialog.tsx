'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface User {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    documentId?: string;
    isAdmin: boolean;
    canPost: boolean;
    canApprove: boolean;
}

interface AddUserFormValues extends User { }

interface AddUserDialogProps {
    onAddUser?: (user: AddUserFormValues) => void;
    onEditUser?: (user: AddUserFormValues) => void;
    userToEdit?: AddUserFormValues;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
}

export function AddUserDialog({
    onAddUser,
    onEditUser,
    userToEdit,
    open: controlledOpen,
    onOpenChange,
    trigger,
    title,
    description
}: AddUserDialogProps) {
    const t = useTranslations('shared.user');
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<AddUserFormValues>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            canPost: false,
            canApprove: false,
        }
    });

    const isAdmin = watch('isAdmin');
    const canPost = watch('canPost');
    const canApprove = watch('canApprove');

    const maskPhone = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length > 11) {
            return cleanValue.slice(0, 11);
        }
        return cleanValue.replace(
            /^(\d{2})(\d{5})(\d{4})?/,
            (_: any, ddd: string, first: string, last: string) => {
                if (last) return `(${ddd}) ${first}-${last}`;
                if (first) return `(${ddd}) ${first}`;
                return `(${ddd}`;
            }
        );
    };

    // Reset form when dialog opens/closes or userToEdit changes
    useEffect(() => {
        if (open) {
            if (userToEdit) {
                reset({
                    ...userToEdit,
                    phone: maskPhone(userToEdit.phone)
                });
            } else {
                reset({
                    name: '',
                    email: '',
                    phone: '',
                    isAdmin: false,
                    canPost: false,
                    canApprove: false,
                });
            }
        } else {
            reset({
                name: '',
                email: '',
                phone: '',
                isAdmin: false,
                canPost: false,
                canApprove: false,
            });
        }
    }, [open, userToEdit, reset]);

    const onSubmit = (data: AddUserFormValues) => {
        // Remove mask from phone before saving
        const cleanPhone = data.phone.replace(/\D/g, '');
        const userData = { ...data, phone: cleanPhone };
        if (userToEdit && onEditUser) {
            onEditUser(userData);
        } else if (onAddUser) {
            onAddUser(userData);
        }
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {userToEdit ? t('editTitle') : title || t('addTitle')}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>{description || t('description')}</DialogDescription>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('name')}</label>
                        <Input
                            {...register('name', { required: t('nameRequired') })}
                            placeholder={t('namePlaceholder')}
                        />
                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('email')}</label>
                        <Input
                            {...register('email', {
                                required: t('emailRequired'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('emailInvalid')
                                }
                            })}
                            type="email"
                            placeholder={t('emailPlaceholder')}
                        />
                        {errors.email && (
                            <span className="text-xs text-red-500">{errors.email.message}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('phone')}</label>
                        <Input
                            {...register('phone', {
                                required: t('phoneRequired'),
                                pattern: {
                                    value: /^\(\d{2}\) \d{5}-\d{4}$/,
                                    message: t('phoneInvalid')
                                },
                                onChange: (e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length > 11) {
                                        e.target.value = e.target.value.slice(0, 11);
                                        return;
                                    }
                                    const masked = value.replace(
                                        /^(\d{2})(\d{5})(\d{4})?/,
                                        (_: any, ddd: string, first: string, last: string) => {
                                            if (last) return `(${ddd}) ${first}-${last}`;
                                            if (first) return `(${ddd}) ${first}`;
                                            return `(${ddd}`;
                                        }
                                    );
                                    e.target.value = masked;
                                }
                            })}
                            maxLength={15}
                            placeholder={t('phonePlaceholder')}
                        />
                        {errors.phone && (
                            <span className="text-xs text-red-500">{errors.phone.message}</span>
                        )}
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isAdmin" className="text-sm font-medium">
                                {t('permissions.isAdmin')}
                            </Label>
                            <Switch
                                id="isAdmin"
                                checked={isAdmin}
                                onCheckedChange={(checked) => setValue('isAdmin', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="canPost" className="text-sm font-medium">
                                {t('permissions.canPost')}
                            </Label>
                            <Switch
                                id="canPost"
                                checked={canPost}
                                onCheckedChange={(checked) => setValue('canPost', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="canApprove" className="text-sm font-medium">
                                {t('permissions.canApprove')}
                            </Label>
                            <Switch
                                id="canApprove"
                                checked={canApprove}
                                onCheckedChange={(checked) => setValue('canApprove', checked)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                        >
                            {userToEdit ? t('save') : t('add')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 