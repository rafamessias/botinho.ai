"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Loader2, Smartphone } from "lucide-react"
import { toast } from "sonner"
import {
  createWhatsAppSessionAction,
  deleteWhatsAppSessionAction,
  getWhatsAppSessionQrAction,
  updateWhatsAppSessionLabelAction,
  type WhatsAppSessionView,
} from "@/components/server-actions/whatsapp"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PairingPhase = "creating" | "waiting" | "connected" | "failed"

type WhatsAppPairingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId?: string
  resumeSessionId?: string
  resumeSessionLabel?: string | null
  onCompleted: () => void
  onSessionUpdate?: () => void
}

export const WhatsAppPairingDialog = ({
  open,
  onOpenChange,
  companyId,
  resumeSessionId,
  resumeSessionLabel,
  onCompleted,
  onSessionUpdate,
}: WhatsAppPairingDialogProps) => {
  const t = useTranslations("Settings.page")
  const [label, setLabel] = useState("")
  const [phase, setPhase] = useState<PairingPhase>("creating")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [session, setSession] = useState<WhatsAppSessionView | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasStartedRef = useRef(false)
  const labelRef = useRef("")

  useEffect(() => {
    labelRef.current = label
  }, [label])

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  const resetState = useCallback(() => {
    clearPollTimer()
    hasStartedRef.current = false
    setPhase("creating")
    setSessionId(null)
    setQrImage(null)
    setSession(null)
    setErrorMessage(null)
    setLabel("")
  }, [clearPollTimer])

  useEffect(() => {
    if (open && resumeSessionLabel) {
      setLabel(resumeSessionLabel)
    }
  }, [open, resumeSessionLabel])

  useEffect(() => {
    if (!open) {
      resetState()
    }
    return () => clearPollTimer()
  }, [open, resetState, clearPollTimer])

  const pollQr = useCallback(
    async (activeSessionId: string) => {
      const response = await getWhatsAppSessionQrAction({
        companyId,
        sessionId: activeSessionId,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error ?? t("whatsapp.pairing.messages.unexpected"))
      }

      setSession(response.data.session)

      if (response.data.qrImage) {
        setQrImage(response.data.qrImage)
      }

      if (response.data.session.connected) {
        const trimmedLabel = labelRef.current.trim()
        if (trimmedLabel && trimmedLabel !== (response.data.session.label ?? "")) {
          await updateWhatsAppSessionLabelAction({
            companyId,
            sessionId: activeSessionId,
            label: trimmedLabel,
          }).catch((error) => {
            console.error("Failed to save session name on connect", error)
          })
        }

        onSessionUpdate?.()
        setPhase("connected")
        clearPollTimer()
        toast.success(t("toasts.whatsappLinked"))
        onCompleted()
        return
      }

      onSessionUpdate?.()
    },
    [clearPollTimer, companyId, onCompleted, onSessionUpdate, t],
  )

  const startPolling = useCallback(
    async (activeSessionId: string) => {
      setPhase("waiting")
      await pollQr(activeSessionId)
      clearPollTimer()
      pollTimerRef.current = setInterval(() => {
        void pollQr(activeSessionId).catch((error) => {
          console.error("QR poll failed", error)
        })
      }, 3000)
    },
    [clearPollTimer, pollQr],
  )

  const handleStartPairing = useCallback(async () => {
    if (!companyId) {
      toast.error(t("toasts.selectCompany"))
      return
    }

    setErrorMessage(null)
    setPhase("creating")
    setQrImage(null)

    try {
      if (resumeSessionId) {
        setSessionId(resumeSessionId)
        onSessionUpdate?.()
        await startPolling(resumeSessionId)
        return
      }

      const response = await createWhatsAppSessionAction({
        companyId,
        ...(labelRef.current.trim() ? { label: labelRef.current.trim() } : {}),
      })

      if (!response.success || !response.data) {
        throw new Error(response.error ?? t("whatsapp.pairing.messages.connectionFailed"))
      }

      const created = response.data.session
      setSessionId(created.sessionId)
      setSession(created)
      onSessionUpdate?.()
      await startPolling(created.sessionId)
    } catch (error) {
      console.error("Pairing failed", error)
      setPhase("failed")
      setErrorMessage(error instanceof Error ? error.message : t("whatsapp.pairing.messages.failed"))
    }
  }, [companyId, onSessionUpdate, resumeSessionId, startPolling, t])

  useEffect(() => {
    if (!sessionId || !companyId || phase === "failed" || phase === "connected") {
      return
    }

    const trimmed = label.trim()
    if (!trimmed || trimmed === (session?.label ?? "")) {
      return
    }

    const timer = setTimeout(() => {
      void updateWhatsAppSessionLabelAction({
        companyId,
        sessionId,
        label: trimmed,
      })
        .then((response) => {
          if (!response.success || !response.data) {
            return
          }

          setSession(response.data.session)
          onSessionUpdate?.()
        })
        .catch((error) => {
          console.error("Failed to save session name during pairing", error)
        })
    }, 500)

    return () => clearTimeout(timer)
  }, [companyId, label, onSessionUpdate, phase, session?.label, sessionId])

  useEffect(() => {
    if (!open || !companyId || hasStartedRef.current) {
      return
    }

    hasStartedRef.current = true
    void handleStartPairing()
  }, [open, companyId, handleStartPairing])

  const handleCancel = async () => {
    clearPollTimer()
    if (sessionId) {
      await deleteWhatsAppSessionAction({ companyId, sessionId }).catch(() => undefined)
    }
    onOpenChange(false)
  }

  const statusMessage = (() => {
    switch (phase) {
      case "creating":
        return t("whatsapp.pairing.messages.connecting")
      case "waiting":
        return qrImage
          ? t("whatsapp.pairing.messages.scan")
          : t("whatsapp.pairing.messages.requesting")
      case "connected":
        return t("whatsapp.pairing.messages.completed")
      case "failed":
        return errorMessage ?? t("whatsapp.pairing.messages.failed")
    }
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t("whatsapp.pairing.title")}
          </DialogTitle>
          <DialogDescription>{t("whatsapp.pairing.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {phase !== "connected" && (
            <div className="space-y-2">
              <Label htmlFor="whatsapp-session-name">{t("whatsapp.pairing.nameLabel")}</Label>
              <Input
                id="whatsapp-session-name"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder={t("whatsapp.pairing.nameHint")}
                maxLength={120}
              />
            </div>
          )}

          <p className="text-sm text-muted-foreground">{statusMessage}</p>

          {!qrImage && (phase === "creating" || phase === "waiting") && (
            <div className="flex flex-col items-center gap-2 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{t("whatsapp.pairing.button.preparing")}</p>
            </div>
          )}

          {qrImage && (phase === "waiting" || phase === "creating") && (
            <div className="flex flex-col items-center gap-2">
              <Image
                src={qrImage}
                alt={t("whatsapp.pairing.qrAlt")}
                width={220}
                height={220}
                unoptimized
                className="rounded-lg border bg-card p-2"
              />
              <p className="text-xs text-muted-foreground">{t("whatsapp.pairing.button.waiting")}</p>
            </div>
          )}

          {session?.phoneNumber && phase !== "failed" && (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="font-medium">{t("whatsapp.pairing.latest.title")}</p>
              <p className="text-muted-foreground">{session.phoneNumber}</p>
            </div>
          )}

          {errorMessage && phase === "failed" && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => void handleCancel()}>
              {phase === "connected" ? "Close" : "Cancel"}
            </Button>

            {phase === "failed" && (
              <Button type="button" onClick={() => void handleStartPairing()}>
                {t("whatsapp.pairing.button.retry")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
