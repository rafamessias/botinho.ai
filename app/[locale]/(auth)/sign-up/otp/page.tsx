import { getTranslations } from 'next-intl/server'
import { OTPForm } from '@/components/sign-up/otp-form'

export default async function OTPPage() {
    const t = await getTranslations('OTPPage')


    return (
        <div className="min-h-screen flex items-center justify-center bg-sidebar">
            <div className="w-full max-w-md space-y-6 p-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
                <OTPForm />
            </div>
        </div>
    )
}
