'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { User } from './add-user-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface UserItemProps extends User {
    onEdit?: (user: User) => void;
    onRemove?: () => void;
}

export function UserItem({ name, email, phone, onEdit, onRemove }: UserItemProps) {
    const t = useTranslations('shared.user');

    return (
        <Card className="p-4 shadow-none hover:shadow-none h-[100px] bg-slate-50 flex">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <AvatarFallback>{name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="font-medium">{name}</h4>
                        <p className="text-sm text-muted-foreground">
                            {email.length > 15
                                ? `${email.slice(0, 5)}...${email.slice(-5)}`
                                : email}
                        </p>
                        <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {onEdit && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit({ name, email, phone })}
                            title={t('edit')}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {onRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onRemove}
                            title={t('remove')}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </Card >
    );
} 