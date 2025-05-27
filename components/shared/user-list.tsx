'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { UserItem } from './user-item';
import { AddUserDialog, User } from './add-user-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface UserListRef {
    getUsers: () => User[];
}

interface UserListProps {
    onUsersChange?: (users: User[]) => void;
}

export const UserList = forwardRef<UserListRef, UserListProps>(({
    onUsersChange
}, ref) => {
    const t = useTranslations('shared.user');
    const [users, setUsers] = useState<User[]>([]);
    const [userToEdit, setUserToEdit] = useState<User | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        getUsers: () => users
    }));

    const handleAddUser = (newUser: User) => {
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        onUsersChange?.(updatedUsers);
        setIsDialogOpen(false);
    };

    const handleEditUser = (index: number, updatedUser: User) => {
        const newUsers = [...users];
        newUsers[index] = updatedUser;
        setUsers(newUsers);
        onUsersChange?.(newUsers);
        setUserToEdit(undefined);
        setIsDialogOpen(false);
    };

    const handleRemoveUser = (index: number) => {
        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
        onUsersChange?.(newUsers);
    };

    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('title')}</h3>
                <AddUserDialog
                    onAddUser={handleAddUser}
                    onEditUser={userToEdit ? (user) => handleEditUser(users.findIndex(u => u.email === userToEdit.email), user) : undefined}
                    userToEdit={userToEdit}
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setUserToEdit(undefined);
                        }
                    }}
                    title={t('title')}
                    description={t('description')}
                    trigger={
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-primary bg-white hover:bg-gray-100 hover:text-primary border border-gray-200"
                            onClick={() => {
                                setUserToEdit(undefined);
                                setIsDialogOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('addButton')}
                        </Button>
                    }
                />
            </div>

            <div className="space-y-2">
                {users.map((user, index) => (
                    <UserItem
                        key={`${user.email}-${index}`}
                        {...user}
                        onEdit={handleEditClick}
                        onRemove={() => handleRemoveUser(index)}
                    />
                ))}
                {users.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                        {t('empty')}
                    </div>
                )}
            </div>
        </div>
    );
}); 