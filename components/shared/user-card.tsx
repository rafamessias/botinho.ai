'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { User as UserType } from '@/components/types/strapi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserCardProps {
    user: UserType | any; // Allow for project-users structure
    t: (key: string) => string;
}

export default function UserCard({ user, t }: UserCardProps) {
    // Handle both direct user objects and project-users with nested user
    const userData = user.user || user;
    const role = user.canApprove || (user as any).canApprove;

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    const getRoleLabel = (role?: string) => {
        if (!role) return t('userCard.noRole');
        return t('userCard.role.canApprove');
    };

    const getRoleVariant = (role?: string) => {
        if (!role) return 'outline';
        return 'default';

    }


    return (
        <Card className="border border-gray-100 px-2 py-1 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={typeof userData.avatar === 'object' && userData.avatar && 'url' in userData.avatar ? userData.avatar.url : undefined} alt={`${userData.firstName} ${userData.lastName}`} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                            {getInitials(userData.firstName, userData.lastName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base truncate">
                                    {userData.firstName} {userData.lastName}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                    {userData.email}
                                </p>
                            </div>
                            <Badge variant={getRoleVariant(role)} className="text-xs">
                                {getRoleLabel(role)}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            {userData.phone && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Phone className="h-3 w-3" />
                                    <span>{userData.phone}</span>
                                </div>
                            )}

                            {user.createdAt && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {t('userCard.memberSince')} {format(new Date(user.createdAt), "MMM yyyy", { locale: ptBR })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}; 