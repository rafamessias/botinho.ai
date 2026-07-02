import { SignUpForm } from "@/components/sign-up/sign-up-form"
import { BrandLogoLink } from "@/components/brand-logo-link"

export default function SignUpPage() {
    const isOTPEnabled = process.env.OTP_ENABLED === 'TRUE'

    return (
        <div className="bg-sidebar flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <BrandLogoLink className="self-center" />
                <SignUpForm isOTPEnabled={isOTPEnabled} />
            </div>
        </div>
    )
}
