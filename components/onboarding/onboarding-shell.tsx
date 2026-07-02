import { BrandLogoLink } from "@/components/brand-logo-link"
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type OnboardingShellProps = {
  step: 1 | 2 | 3 | 4
  title: string
  description: string
  children: React.ReactNode
}

export const OnboardingShell = ({ step, title, description, children }: OnboardingShellProps) => (
  <div className="bg-sidebar flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <BrandLogoLink className="self-center" />
      <OnboardingStepper currentStep={step} />
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  </div>
)
