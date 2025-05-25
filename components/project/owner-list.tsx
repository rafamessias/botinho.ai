'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
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

export interface OwnerListRef {
    getOwners: () => Owner[];
}

export const OwnerList = forwardRef<OwnerListRef>((_, ref) => {
    const [owners, setOwners] = useState<Owner[]>([]);

    useImperativeHandle(ref, () => ({
        getOwners: () => owners
    }));

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
                        <Button size="sm" variant="outline" className="text-primary bg-white hover:bg-gray-100 hover:text-primary border border-gray-200">
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
}); 