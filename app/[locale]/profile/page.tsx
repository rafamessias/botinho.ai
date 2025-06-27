import ContainerApp from '@/components/Container-app';
import ProfileForm from './profile-form';
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ locale: string }> }) {
    const { locale } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'profile' });

    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <ProfileForm />
        </ContainerApp>
    );
} 