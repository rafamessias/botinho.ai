import ContainerApp from '@/components/Container-app';
import ProfileForm from './profile-form';
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ locale: string }> }) {
    const { locale } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'profile' });

    // TODO: Replace with real user fetch
    const user = {
        name: 'James Harrid',
        phone: '123-456-7890',
        email: 'example@email.com',
        birthday: '',
        avatar: '',
        notifyRDO: true,
    };

    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <ProfileForm user={user} />
        </ContainerApp>
    );
} 