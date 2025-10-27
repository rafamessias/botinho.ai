import { BarChart3, GalleryVerticalEnd } from "lucide-react"

import { SignUpForm } from "@/components/sign-up/sign-up-form"
import { Link } from "@/i18n/navigation"

export default function SignUpPage() {
    const isOTPEnabled = process.env.OTP_ENABLED === 'TRUE'

    return (
        <div className="bg-sidebar flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-sm">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    Opineeo
                </Link>
                <SignUpForm isOTPEnabled={isOTPEnabled} />
            </div>
        </div>
    )
}
