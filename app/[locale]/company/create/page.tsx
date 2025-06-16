import { CreateCompanyForm } from '@/components/company/create-company-form';
import ContainerApp from '@/components/Container-app';
import { getTranslations } from 'next-intl/server';

export default async function CreateCompanyPage() {
    const t = await getTranslations('company');
    return (
        <ContainerApp title={t('title')} showBackButton={true}>
            <CreateCompanyForm />
        </ContainerApp>
    );
} 