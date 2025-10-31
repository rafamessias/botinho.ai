"use client"

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PairingState = "idle" | "connecting" | "ready" | "sending" | "success" | "error"

const statusCopy: Record<PairingState, string> = {
    idle: "",
    connecting: "Connecting to pairing session…",
    ready: "Review the device details and confirm to finish linking.",
    sending: "Sending details to dashboard…",
    success: "Device linked successfully. You can return to the dashboard.",
    error: "",
}

const getSocketUrl = () => {
    if (typeof window === "undefined") {
        return ""
    }

    const configured = process.env.NEXT_PUBLIC_WS_SERVER_URL?.trim()

    if (configured) {
        if (configured.startsWith("ws://") || configured.startsWith("wss://")) {
            return configured
        }

        if (configured.startsWith("http://") || configured.startsWith("https://")) {
            return configured.replace(/^http/, "ws").replace(/^https/, "wss")
        }

        return `ws://${configured.replace(/^\/\//, "")}`
    }

    const isHttps = window.location.protocol === "https:"
    const defaultPort = process.env.NEXT_PUBLIC_WS_SERVER_PORT ?? "3100"
    return `${isHttps ? "wss" : "ws"}://${window.location.hostname}:${defaultPort}`
}

export default function WhatsappQrPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")?.toString() ?? ""

    const [pairingState, setPairingState] = useState<PairingState>("idle")
    const [statusMessage, setStatusMessage] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [formValues, setFormValues] = useState({ displayName: "", phoneNumber: "" })

    const socketRef = useRef<WebSocket | null>(null)
    const pairingStateRef = useRef<PairingState>("idle")

    const setState = useCallback(
        (state: PairingState, options: { message?: string; error?: string | null } = {}) => {
            pairingStateRef.current = state
            setPairingState(state)
            setStatusMessage(options.message ?? statusCopy[state])
            setErrorMessage(options.error ?? null)
        },
        [],
    )

    const tearDownSocket = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close()
        }

        socketRef.current = null
    }, [])

    useEffect(() => {
        if (!token) {
            setState("error", { error: "Invalid pairing link" })
            return
        }

        const url = getSocketUrl()

        if (!url) {
            setState("error", { error: "Unsupported environment" })
            return
        }

        const socket = new WebSocket(url)
        socketRef.current = socket

        setState("connecting")

        socket.onopen = () => {
            setState("connecting", { message: "Authenticating pairing session…" })
            socket.send(
                JSON.stringify({
                    type: "client",
                    step: 0,
                    token,
                }),
            )
        }

        socket.onmessage = (event) => {
            try {
                const payload = typeof event.data === "string" ? JSON.parse(event.data) : null

                if (!payload || typeof payload !== "object") {
                    throw new Error("Invalid pairing payload")
                }

                if (typeof payload.code === "number" && payload.code !== 0) {
                    setState("error", { error: payload.msg ?? "Pairing failed" })
                    tearDownSocket()
                    return
                }

                const step = payload?.data?.step

                if (step === 1) {
                    setState("ready")
                    return
                }

                if (step === 2) {
                    setFormValues((previous) => ({
                        displayName: payload?.data?.displayName ?? previous.displayName,
                        phoneNumber: payload?.data?.phoneNumber ?? previous.phoneNumber,
                    }))
                    setState("success")
                    tearDownSocket()
                }
            } catch (error) {
                console.error("Pairing message parse error", error)
                setState("error", { error: "Unexpected response from server" })
                tearDownSocket()
            }
        }

        socket.onerror = () => {
            setState("error", { error: "Connection error" })
        }

        socket.onclose = () => {
            if (pairingStateRef.current !== "success" && pairingStateRef.current !== "error") {
                setState("error", { error: "Pairing session closed" })
            }
        }

        return () => {
            tearDownSocket()
        }
    }, [setState, tearDownSocket, token])

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            if (pairingState !== "ready" || !socketRef.current) {
                return
            }

            const displayName = formValues.displayName.trim()
            const phoneNumber = formValues.phoneNumber.trim()

            if (!displayName || !phoneNumber) {
                setErrorMessage("Please provide a name and phone number")
                return
            }

            if (socketRef.current.readyState !== WebSocket.OPEN) {
                setState("error", { error: "Pairing connection lost" })
                return
            }

            setState("sending")

            socketRef.current.send(
                JSON.stringify({
                    type: "client",
                    step: 1,
                    token,
                    displayName,
                    phoneNumber,
                }),
            )
        },
        [formValues.displayName, formValues.phoneNumber, pairingState, setState, token],
    )

    const isSubmitting = pairingState === "sending"
    const canSubmit = pairingState === "ready" || pairingState === "sending"

    const helperText = useMemo(() => {
        if (errorMessage) {
            return errorMessage
        }
        return statusMessage
    }, [errorMessage, statusMessage])

    return (
        <div className="flex min-h-dvh flex-col bg-background px-4 py-10">
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        WhatsApp pairing
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Follow the instructions below to connect this phone to your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm" aria-live="polite">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Phone label</Label>
                        <Input
                            id="displayName"
                            value={formValues.displayName}
                            onChange={(event) => setFormValues((previous) => ({ ...previous, displayName: event.target.value }))}
                            placeholder="e.g., Support Team"
                            tabIndex={0}
                            aria-required="true"
                            aria-label="Phone label"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">WhatsApp number</Label>
                        <Input
                            id="phoneNumber"
                            value={formValues.phoneNumber}
                            onChange={(event) => setFormValues((previous) => ({ ...previous, phoneNumber: event.target.value }))}
                            placeholder="+55 11 98765-4321"
                            tabIndex={0}
                            aria-required="true"
                            aria-label="WhatsApp phone number"
                            inputMode="tel"
                            autoComplete="tel"
                        />
                    </div>

                    <div className="space-y-2 text-sm">
                        <p className={errorMessage ? "text-destructive" : "text-muted-foreground"}>{helperText}</p>
                        {pairingState === "success" && (
                            <p className="text-xs text-emerald-600">You may close this tab and return to the dashboard.</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={!canSubmit || isSubmitting}
                        aria-label="Confirm device details"
                    >
                        {pairingState === "success" ? "Paired" : isSubmitting ? "Linking…" : "Confirm device"}
                    </Button>
                </form>

                <footer className="text-center text-xs text-muted-foreground">
                    Having trouble? Make sure the QR code is still visible on the dashboard, then refresh this page.
                </footer>
            </div>
        </div>
    )
}


