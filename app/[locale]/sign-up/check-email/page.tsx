import { Suspense } from "react"
import { CheckEmailForm } from "@/components/sign-up/check-email-form"
import { useTranslations } from "next-intl"

export default function CheckEmailPage() {
    const t = useTranslations("CheckEmailPage")

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none bg-muted">
            <div className="mx-auto flex w-[350px] flex-col justify-center space-y-6 sm:w-[350px]">
                <Suspense fallback={<div>Loading...</div>}>
                    <CheckEmailForm />
                </Suspense>
            </div>

        </div>
    )
}
