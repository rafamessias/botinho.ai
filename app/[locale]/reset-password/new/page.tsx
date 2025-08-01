import NewPasswordForm from './new-password-form';

export default async function NewPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return (
        <div className="flex items-center justify-center h-dvh">
            <NewPasswordForm locale={locale} />
        </div>
    );
} 