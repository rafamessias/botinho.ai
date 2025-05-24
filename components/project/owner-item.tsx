import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddOwnerDialog } from './add-owner-dialog';

interface OwnerItemProps {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    onEdit?: (owner: { name: string; email: string; phone: string }) => void;
    onRemove?: () => void;
}

export function OwnerItem({ name, email, phone, avatar, onEdit, onRemove }: OwnerItemProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between gap-3 bg-muted rounded-lg p-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {avatar ? (
                            <Image src={avatar} alt={name} width={40} height={40} />
                        ) : (
                            <Image src="/placeholder-avatar.webp" alt={name} width={40} height={40} />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-sm">{name}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                        <div className="text-xs text-muted-foreground">{phone}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar proprietário</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover proprietário</span>
                    </Button>
                </div>
            </div>

            <AddOwnerDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                ownerToEdit={{ name, email, phone }}
                onEditOwner={onEdit}
            />
        </>
    );
} 