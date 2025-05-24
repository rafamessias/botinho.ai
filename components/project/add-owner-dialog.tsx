'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddOwnerFormValues {
    name: string;
    email: string;
    phone: string;
}

interface AddOwnerDialogProps {
    onAddOwner?: (owner: AddOwnerFormValues) => void;
    onEditOwner?: (owner: AddOwnerFormValues) => void;
    ownerToEdit?: AddOwnerFormValues;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export function AddOwnerDialog({
    onAddOwner,
    onEditOwner,
    ownerToEdit,
    open: controlledOpen,
    onOpenChange,
    trigger
}: AddOwnerDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddOwnerFormValues>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        }
    });

    useEffect(() => {
        if (ownerToEdit) {
            reset(ownerToEdit);
        }
    }, [ownerToEdit, reset]);

    const onSubmit = (data: AddOwnerFormValues) => {
        if (ownerToEdit && onEditOwner) {
            onEditOwner(data);
        } else if (onAddOwner) {
            onAddOwner(data);
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
                        {ownerToEdit ? 'Editar Proprietário' : 'Adicionar Proprietário'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            {...register('name', { required: 'Nome é obrigatório' })}
                            placeholder="Nome do proprietário"
                        />
                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            {...register('email', {
                                required: 'Email é obrigatório',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email inválido'
                                }
                            })}
                            type="email"
                            placeholder="email@exemplo.com"
                        />
                        {errors.email && (
                            <span className="text-xs text-red-500">{errors.email.message}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone</label>
                        <Input
                            {...register('phone', {
                                required: 'Telefone é obrigatório',
                                pattern: {
                                    value: /^\(\d{2}\) \d{5}-\d{4}$/,
                                    message: 'Formato inválido. Use (99) 99999-9999'
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
                            placeholder="(xx) xxxxx-xxxx"
                        />
                        {errors.phone && (
                            <span className="text-xs text-red-500">{errors.phone.message}</span>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {ownerToEdit ? 'Salvar' : 'Adicionar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 