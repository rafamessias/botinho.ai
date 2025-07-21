import ContainerApp from '@/components/Container-app';
import ProfileForm from './profile-form';
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ locale: string }> }) {
    const { locale } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'profile' });

    // TEMPORARY: Add delay to test loading skeleton
    //await new Promise(resolve => setTimeout(resolve, 300000)); // 3 second delay

    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <ProfileForm />
        </ContainerApp>
    );
} 