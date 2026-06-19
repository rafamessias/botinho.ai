import { SignInForm } from "@/components/sign-in/sign-in-form"
import { BrandLogoLink } from "@/components/brand-logo-link"

export default function SignInPage() {
    return (
        <div className="bg-sidebar flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <BrandLogoLink className="self-center" />
                <SignInForm />
            </div>
        </div>
    )
}
