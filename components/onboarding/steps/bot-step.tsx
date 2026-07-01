"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  advanceOnboardingStepAction,
  completeOnboardingBotStepAction,
  getOnboardingPhoneOptionsAction,
} from "@/components/server-actions/onboarding"

export const BotStep = () => {
  const t = useTranslations("Onboarding.bot")
  const router = useRouter()
  const [name, setName] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [sessionIds, setSessionIds] = useState<string[]>([])
  const [sessions, setSessions] = useState<Array<{ sessionId: string; label: string | null; phoneNumber: string | null }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)

  useEffect(() => {
    void getOnboardingPhoneOptionsAction().then((result) => {
      if (result.success && result.data) {
        setSessions(result.data.sessions)
      }
    })
  }, [])

  const handleSkip = async () => {
    setIsSkipping(true)
    try {
      const result = await advanceOnboardingStepAction({ step: 4 })
      if (!result.success) {
        toast.error(result.error ?? t("error"))
        return
      }
      router.push("/onboarding/plan")
    } finally {
      setIsSkipping(false)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t("nameRequired"))
      return
    }

    setIsSubmitting(true)
    try {
      const result = await completeOnboardingBotStepAction({
        name: name.trim(),
        systemPrompt: systemPrompt.trim() || undefined,
        sessionIds: sessionIds.length > 0 ? sessionIds : undefined,
      })
      if (!result.success) {
        toast.error(result.error ?? t("error"))
        return
      }
      router.push("/onboarding/plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSession = (sessionId: string) => {
    setSessionIds((current) =>
      current.includes(sessionId) ? current.filter((id) => id !== sessionId) : [...current, sessionId],
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bot-name">{t("nameLabel")}</Label>
        <Input id="bot-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t("namePlaceholder")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bot-prompt">{t("promptLabel")}</Label>
        <Textarea
          id="bot-prompt"
          value={systemPrompt}
          onChange={(event) => setSystemPrompt(event.target.value)}
          placeholder={t("promptPlaceholder")}
          rows={4}
        />
      </div>

      {sessions.length > 0 && (
        <div className="space-y-2">
          <Label>{t("sessionsLabel")}</Label>
          <div className="space-y-2 rounded-lg border p-3">
            {sessions.map((session) => (
              <label key={session.sessionId} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={sessionIds.includes(session.sessionId)}
                  onCheckedChange={() => toggleSession(session.sessionId)}
                />
                <span>{session.label ?? session.phoneNumber ?? session.sessionId}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" className="flex-1" onClick={() => void handleSubmit()} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("create")}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={() => void handleSkip()} disabled={isSkipping}>
          {isSkipping ? <Loader2 className="h-4 w-4 animate-spin" /> : t("skip")}
        </Button>
      </div>
    </div>
  )
}
