'use client';

import { useState } from 'react';
import { OwnerItem } from './owner-item';
import { AddOwnerDialog } from './add-owner-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Owner {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export function OwnerList() {
    const [owners, setOwners] = useState<Owner[]>([]);

    const handleAddOwner = (newOwner: Owner) => {
        setOwners([...owners, newOwner]);
    };

    const handleEditOwner = (index: number, updatedOwner: Owner) => {
        const newOwners = [...owners];
        newOwners[index] = updatedOwner;
        setOwners(newOwners);
    };

    const handleRemoveOwner = (index: number) => {
        setOwners(owners.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Proprietários</h3>
                <AddOwnerDialog
                    onAddOwner={handleAddOwner}
                    trigger={
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Proprietário
                        </Button>
                    }
                />
            </div>

            <div className="space-y-2">
                {owners.map((owner, index) => (
                    <OwnerItem
                        key={`${owner.email}-${index}`}
                        {...owner}
                        onEdit={(updatedOwner) => handleEditOwner(index, updatedOwner)}
                        onRemove={() => handleRemoveOwner(index)}
                    />
                ))}
                {owners.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                        Nenhum proprietário adicionado
                    </div>
                )}
            </div>
        </div>
    );
} 