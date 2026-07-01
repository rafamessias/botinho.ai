"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CheckCircle2, Loader2, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  advanceOnboardingStepAction,
  createOnboardingWhatsAppSessionAction,
  getOnboardingWhatsAppQrAction,
} from "@/components/server-actions/onboarding"

type WhatsAppStepProps = {
  whatsAppConfigured: boolean
}

type PairingPhase = "idle" | "creating" | "waiting" | "finalizing" | "connected" | "failed"

export const WhatsAppStep = ({ whatsAppConfigured }: WhatsAppStepProps) => {
  const t = useTranslations("Onboarding.whatsapp")
  const router = useRouter()
  const [label, setLabel] = useState("")
  const [phase, setPhase] = useState<PairingPhase>("idle")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSkipping, setIsSkipping] = useState(false)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  useEffect(() => () => clearPollTimer(), [clearPollTimer])

  const pollQr = useCallback(
    async (activeSessionId: string) => {
      const response = await getOnboardingWhatsAppQrAction({ sessionId: activeSessionId })
      if (!response.success || !response.data) {
        throw new Error(response.error ?? t("error"))
      }

      if (response.data.session.connected) {
        clearPollTimer()
        setPhoneNumber(response.data.session.phoneNumber)
        setPhase("connected")
        toast.success(t("connected"))
        return
      }

      if (response.data.session.loggedIn || response.data.session.hasCredentials) {
        setQrImage(null)
        setPhase("finalizing")
      } else if (response.data.qrImage) {
        setQrImage(response.data.qrImage)
        setPhase("waiting")
      }
    },
    [clearPollTimer, t],
  )

  const handleStartPairing = async () => {
    if (!whatsAppConfigured) {
      return
    }

    setErrorMessage(null)
    setPhase("creating")

    try {
      const response = await createOnboardingWhatsAppSessionAction({
        ...(label.trim() ? { label: label.trim() } : {}),
      })

      if (!response.success || !response.data) {
        throw new Error(response.error ?? t("error"))
      }

      const created = response.data.session
      setSessionId(created.sessionId)
      setPhase("waiting")
      await pollQr(created.sessionId)
      clearPollTimer()
      pollTimerRef.current = setInterval(() => {
        void pollQr(created.sessionId).catch((error) => {
          console.error("QR poll failed", error)
        })
      }, 3000)
    } catch (error) {
      setPhase("failed")
      setErrorMessage(error instanceof Error ? error.message : t("error"))
    }
  }

  const handleSkip = async () => {
    setIsSkipping(true)
    try {
      const result = await advanceOnboardingStepAction({ step: 3 })
      if (!result.success) {
        toast.error(result.error ?? t("error"))
        return
      }
      router.push("/onboarding/bot")
    } finally {
      setIsSkipping(false)
    }
  }

  const handleContinue = async () => {
    setIsSkipping(true)
    try {
      const result = await advanceOnboardingStepAction({ step: 3 })
      if (!result.success) {
        toast.error(result.error ?? t("error"))
        return
      }
      router.push("/onboarding/bot")
    } finally {
      setIsSkipping(false)
    }
  }

  if (!whatsAppConfigured) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("notConfigured")}</p>
        <Button type="button" variant="outline" className="w-full" onClick={() => void handleSkip()} disabled={isSkipping}>
          {isSkipping ? <Loader2 className="h-4 w-4 animate-spin" /> : t("skip")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Smartphone className="h-4 w-4" />
        <span>{t("hint")}</span>
      </div>

      {phase === "idle" && (
        <div className="space-y-2">
          <Label htmlFor="whatsapp-label">{t("labelOptional")}</Label>
          <Input
            id="whatsapp-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={t("labelPlaceholder")}
            maxLength={120}
          />
        </div>
      )}

      {phase === "creating" && (
        <div className="flex flex-col items-center gap-2 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("creating")}</p>
        </div>
      )}

      {phase === "waiting" && qrImage && (
        <div className="flex flex-col items-center gap-2">
          <Image src={qrImage} alt={t("qrAlt")} width={220} height={220} unoptimized className="rounded-lg border bg-card p-2" />
          <p className="text-sm text-muted-foreground">{t("scan")}</p>
        </div>
      )}

      {phase === "finalizing" && (
        <div className="flex flex-col items-center gap-2 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("finalizing")}</p>
        </div>
      )}

      {phase === "connected" && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-4 text-sm">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">{t("connectedTitle")}</p>
            {phoneNumber && <p className="text-muted-foreground">{phoneNumber}</p>}
          </div>
        </div>
      )}

      {phase === "failed" && errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        {phase === "idle" && (
          <Button type="button" className="flex-1" onClick={() => void handleStartPairing()}>
            {t("connect")}
          </Button>
        )}

        {phase === "failed" && (
          <Button type="button" className="flex-1" onClick={() => void handleStartPairing()}>
            {t("retry")}
          </Button>
        )}

        {phase === "connected" ? (
          <Button type="button" className="flex-1" onClick={() => void handleContinue()} disabled={isSkipping}>
            {isSkipping ? <Loader2 className="h-4 w-4 animate-spin" /> : t("continue")}
          </Button>
        ) : (
          <Button type="button" variant="outline" className="flex-1" onClick={() => void handleSkip()} disabled={isSkipping}>
            {isSkipping ? <Loader2 className="h-4 w-4 animate-spin" /> : t("skip")}
          </Button>
        )}
      </div>
    </div>
  )
}
