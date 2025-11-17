"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveLead } from "@/components/server-actions/leads"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Turnstile } from "@marsidev/react-turnstile"

type FormStatus = "idle" | "submitting" | "success" | "error"

export default function LeadForm() {
  const t = useTranslations("Landing.leadForm")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [captchaToken, setCaptchaToken] = useState<string>("")
  const turnstileRef = useRef<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      setErrorMessage(t("errors.requiredFields"))
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(t("errors.invalidEmail"))
      return
    }

    if (!captchaToken) {
      setErrorMessage(t("errors.verificationRequired"))
      return
    }

    try {
      setStatus("submitting")
      setErrorMessage("")

      const result = await saveLead({
        name: name.trim(),
        email: email.trim(),
        captchaToken: captchaToken,
      })

      if (result.success) {
        setStatus("success")
        setName("")
        setEmail("")
        setCaptchaToken("")
        turnstileRef.current?.reset()
        setTimeout(() => {
          setStatus("idle")
        }, 5000)
      } else {
        setStatus("error")
        setErrorMessage(result.error || t("errors.submitFailed"))
        turnstileRef.current?.reset()
        setCaptchaToken("")
      }
    } catch (error) {
      console.error("Error submitting lead form:", error)
      setStatus("error")
      setErrorMessage(t("errors.unexpectedError"))
      turnstileRef.current?.reset()
      setCaptchaToken("")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-primary/10 bg-background/90 p-8 text-center shadow-sm">
        <CheckCircle2 className="size-12 text-green-500" />
        <div>
          <h3 className="text-lg font-semibold">{t("success.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("success.message")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-primary/10 bg-background/90 p-8 shadow-sm">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "submitting"}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          required
          className="h-12"
        />
      </div>

      <div className="flex justify-center">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
          onSuccess={(token) => setCaptchaToken(token)}
          onError={() => {
            setCaptchaToken("")
            setErrorMessage(t("errors.verificationFailed"))
          }}
          onExpire={() => {
            setCaptchaToken("")
          }}
          options={{
            theme: "auto",
            size: "normal",
          }}
        />
      </div>

      {status === "error" && errorMessage && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div>
      )}

      <Button
        type="submit"
        className="w-full rounded-full bg-primary px-6 py-6 text-base font-semibold text-primary-foreground"
        disabled={status === "submitting" || !captchaToken}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          t("button")
        )}
      </Button>
    </form>
  )
}

