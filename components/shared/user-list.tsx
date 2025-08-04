'use client';

import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { UserItem } from './user-item';
import { AddUserDialog } from './add-user-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CompanyMemberDialog } from '@/components/types/prisma';

export interface UserListRef {
    getUsers: () => CompanyMemberDialog[];
}

interface UserListProps {
    onUsersChange?: (users: CompanyMemberDialog[]) => void;
    disabled?: boolean;
    initialUsers?: CompanyMemberDialog[];
    onAddUser?: (user: CompanyMemberDialog) => Promise<CompanyMemberDialog | false>;
    onEditUser?: (user: CompanyMemberDialog) => Promise<CompanyMemberDialog | false>;
    onRemoveUser?: (user: CompanyMemberDialog) => Promise<boolean>;
    showOwner?: boolean;
    showIsAdmin?: boolean;
    showCanPost?: boolean;
    showCanApprove?: boolean;
}

export const UserList = forwardRef<UserListRef, UserListProps>(({
    onUsersChange,
    disabled = false,
    initialUsers = [],
    onAddUser,
    onEditUser,
    onRemoveUser,
    showOwner = true,
    showIsAdmin = true,
    showCanPost = true,
    showCanApprove = true
}, ref) => {
    const t = useTranslations('shared.user');
    const [users, setUsers] = useState<CompanyMemberDialog[]>(initialUsers);
    const [userToEdit, setUserToEdit] = useState<CompanyMemberDialog | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Update users when initialUsers changes
    useEffect(() => {
        if (initialUsers && initialUsers.length > 0 && users.length === 0) {
            setUsers(initialUsers);
        }
    }, [initialUsers]);

    useImperativeHandle(ref, () => ({
        getUsers: () => users
    }));

    const handleAddUser = async (newUser: CompanyMemberDialog) => {
        let updatedUsers;
        if (onAddUser) {
            const result = await onAddUser(newUser);
            if (!result) return;

            // Add the new user with the returned data
            updatedUsers = [...users, result];
        } else {
            updatedUsers = [...users, newUser];
        }

        setUsers(updatedUsers);
        onUsersChange?.(updatedUsers);
        setIsDialogOpen(false);
        setUserToEdit(undefined);
    };

    const handleEditUser = async (index: number, updatedUser: CompanyMemberDialog) => {

        if (onEditUser) {
            // Preserve the id from the existing user
            const existingUser = users[index];
            const userWithDocumentId = {
                ...updatedUser,
                id: existingUser.id
            };

            const result = await onEditUser(userWithDocumentId);
            if (!result) return;

            // Update the user with the returned data
            const newUsers = [...users];
            newUsers[index] = result;
            setUsers(newUsers);
            onUsersChange?.(newUsers);
            setUserToEdit(undefined);
            setIsDialogOpen(false);
        } else {
            const newUsers = [...users];
            newUsers[index] = updatedUser;
            setUsers(newUsers);
            onUsersChange?.(newUsers);
            setUserToEdit(undefined);
        }
    };

    const handleRemoveUser = async (index: number) => {
        const userToRemove = users[index];
        if (!userToRemove.id) {
            console.error('Cannot remove user: missing id');
            return;
        }

        if (onRemoveUser) {
            const result: boolean = await onRemoveUser(userToRemove);
            if (!result) return;
        }

        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
        onUsersChange?.(newUsers);
    };

    const handleEditClick = (user: CompanyMemberDialog) => {
        // Find the complete user data from the users array
        const completeUser = users.find(u => u.email === user.email);
        if (completeUser) {
            setUserToEdit(completeUser);
            setIsDialogOpen(true);
        }
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
                    showOwner={showOwner}
                    showIsAdmin={showIsAdmin}
                    showCanPost={showCanPost}
                    showCanApprove={showCanApprove}
                    trigger={
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-primary bg-white hover:bg-gray-100 hover:text-primary border border-gray-200"
                            onClick={() => {
                                setUserToEdit(undefined);
                                setIsDialogOpen(true);
                            }}
                            disabled={disabled}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('addButton')}
                        </Button>
                    }
                />
            </div>

            <div className="">
                {users.map((user, index) => (
                    <UserItem
                        key={`${user.email}-${index}`}
                        {...user}
                        onEdit={disabled ? undefined : handleEditClick}
                        onRemove={disabled ? undefined : () => handleRemoveUser(index)}
                        showOwner={showOwner}
                        showIsAdmin={showIsAdmin}
                        showCanPost={showCanPost}
                        showCanApprove={showCanApprove}
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