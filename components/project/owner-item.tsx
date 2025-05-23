import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
export function OwnerItem({ name, email, avatar }: { name: string; email: string; avatar: string }) {
    return (
        <div className="flex items-center justify-between gap-3 bg-muted rounded-lg p-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image src={avatar} alt={name} width={40} height={40} />
                </div>
                <div>
                    <div className="font-semibold text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">{email}</div>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remover proprietário</span>
            </Button>
        </div>
    );
} 