import { getTranslations } from 'next-intl/server';
import { SignInForm } from './sign-in-form';

export default async function SignInPage() {
    const t = await getTranslations('auth');

    return (
        <div className="flex items-center justify-center h-full">
            <SignInForm />
        </div>
    );
} 