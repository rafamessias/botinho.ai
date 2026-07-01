"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { completeOnboardingCompanyStepAction } from "@/components/server-actions/onboarding"

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export const CompanyStep = () => {
  const t = useTranslations("Onboarding.company")
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await completeOnboardingCompanyStepAction(data)
      if (!result.success) {
        toast.error(result.error ?? t("error"))
        return
      }
      router.push("/onboarding/whatsapp")
    } catch {
      toast.error(t("error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company-name">{t("nameLabel")}</Label>
        <Input id="company-name" {...register("name")} placeholder={t("namePlaceholder")} />
        {errors.name && <p className="text-sm text-destructive">{t("nameError")}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-description">{t("descriptionLabel")}</Label>
        <Textarea
          id="company-description"
          {...register("description")}
          placeholder={t("descriptionPlaceholder")}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("continue")}
      </Button>
    </form>
  )
}
