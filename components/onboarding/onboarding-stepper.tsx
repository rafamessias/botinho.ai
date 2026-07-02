"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

type OnboardingStepperProps = {
  currentStep: 1 | 2 | 3 | 4
}

const STEPS = [1, 2, 3, 4] as const

export const OnboardingStepper = ({ currentStep }: OnboardingStepperProps) => {
  const t = useTranslations("Onboarding.stepper")

  const labels: Record<(typeof STEPS)[number], string> = {
    1: t("company"),
    2: t("whatsapp"),
    3: t("bot"),
    4: t("plan"),
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step) => (
          <div key={step} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                step <= currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {step}
            </div>
            <span
              className={cn(
                "hidden text-center text-xs sm:block",
                step === currentStep ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {labels[step]}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground sm:hidden">{labels[currentStep]}</p>
    </div>
  )
}
