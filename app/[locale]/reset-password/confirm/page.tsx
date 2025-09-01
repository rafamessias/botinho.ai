import { ResetPasswordConfirmForm } from "@/components/reset-password/reset-password-confirm-form"
import { Suspense } from "react"

export default function ResetPasswordConfirmPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordConfirmForm />
                </Suspense>
            </div>
        </div>
    )
}
