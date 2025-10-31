import { createServer } from "http"
import { AddressInfo } from "net"
import { randomUUID } from "node:crypto"
import dotenv from "dotenv"
import { WebSocket, WebSocketServer } from "ws"
import { z } from "zod"

import { prisma } from "./prisma"

dotenv.config()

const DEFAULT_PORT = 3100
const DEFAULT_PAIRING_BASE_URL = "http://localhost:3000"
const SESSION_TTL_MS = 1000 * 60 * 3

const port = Number.parseInt(process.env.WS_SERVER_PORT ?? "" + DEFAULT_PORT, 10)
const pairingBaseUrl = (process.env.PAIRING_BASE_URL ?? DEFAULT_PAIRING_BASE_URL).replace(/\/$/, "")

type PairingSession = {
    token: string
    companyId: number
    adminSocket?: WebSocket
    phoneSocket?: WebSocket
    createdAt: number
}

const sessions = new Map<string, PairingSession>()
const socketToToken = new WeakMap<WebSocket, string>()

const messageSchema = z.object({
    type: z.union([z.literal("server"), z.literal("client")]),
    step: z.number().int(),
    token: z.string().optional(),
    companyId: z.number().int().positive().optional(),
    displayName: z.string().optional(),
    phoneNumber: z.string().optional(),
})

const createHttpServer = () => {
    const server = createServer()
    const wss = new WebSocketServer({ server })

    wss.on("connection", (socket) => {
        const handleClose = () => {
            const token = socketToToken.get(socket)
            if (!token) {
                return
            }

            const session = sessions.get(token)
            if (!session) {
                socketToToken.delete(socket)
                return
            }

            const reason =
                session.adminSocket === socket
                    ? "Pairing cancelled from dashboard"
                    : "Phone disconnected before completing pairing"

            if (session.adminSocket && session.adminSocket !== socket && session.adminSocket.readyState === WebSocket.OPEN) {
                sendJson(session.adminSocket, { code: -1, msg: reason })
                session.adminSocket.close()
            }

            if (session.phoneSocket && session.phoneSocket !== socket && session.phoneSocket.readyState === WebSocket.OPEN) {
                sendJson(session.phoneSocket, { code: -1, msg: reason })
                session.phoneSocket.close()
            }

            cleanupSession(token)
        }

        socket.on("close", handleClose)
        socket.on("error", handleClose)

        socket.on("message", async (raw) => {
            let payload: z.infer<typeof messageSchema>

            try {
                payload = messageSchema.parse(JSON.parse(raw.toString()))
            } catch (error) {
                sendJson(socket, { code: -1, msg: "Invalid payload" })
                return
            }

            if (payload.type === "server" && payload.step === 0) {
                if (payload.companyId == null) {
                    sendJson(socket, { code: -1, msg: "Missing company identifier" })
                    return
                }

                const token = randomUUID()
                const session: PairingSession = {
                    token,
                    companyId: payload.companyId,
                    adminSocket: socket,
                    createdAt: Date.now(),
                }

                sessions.set(token, session)
                socketToToken.set(socket, token)

                sendJson(socket, {
                    code: 0,
                    msg: "Ready",
                    data: {
                        step: 0,
                        token,
                        pairingUrl: `${pairingBaseUrl}/whatsapp/qr?token=${encodeURIComponent(token)}`,
                    },
                })
                return
            }

            if (payload.type === "client") {
                if (!payload.token) {
                    sendJson(socket, { code: -1, msg: "Missing pairing token" })
                    return
                }

                const session = sessions.get(payload.token)
                if (!session) {
                    sendJson(socket, { code: -1, msg: "Pairing not found or expired" })
                    return
                }

                if (payload.step === 0) {
                    if (session.phoneSocket && session.phoneSocket !== socket) {
                        sendJson(socket, { code: -1, msg: "Token already linked" })
                        return
                    }

                    session.phoneSocket = socket
                    socketToToken.set(socket, payload.token)

                    sendJson(socket, { code: 0, msg: "Scan successful", data: { step: 1 } })

                    if (session.adminSocket && session.adminSocket.readyState === WebSocket.OPEN) {
                        sendJson(session.adminSocket, { code: 0, msg: "Device scanned", data: { step: 1 } })
                    }
                    return
                }

                if (payload.step === 1) {
                    if (session.phoneSocket !== socket) {
                        sendJson(socket, { code: -1, msg: "Pairing mismatch" })
                        return
                    }

                    const displayName = payload.displayName?.trim()
                    const phoneNumber = payload.phoneNumber?.trim()

                    if (!displayName || !phoneNumber) {
                        sendJson(socket, { code: -1, msg: "Missing device details" })
                        return
                    }

                    try {
                        const whatsappNumber = await prisma.companyWhatsappNumber.upsert({
                            where: {
                                companyId_phoneNumber: {
                                    companyId: session.companyId,
                                    phoneNumber,
                                },
                            },
                            create: {
                                companyId: session.companyId,
                                displayName,
                                phoneNumber,
                                isConnected: true,
                                lastSyncedAt: new Date(),
                            },
                            update: {
                                displayName,
                                phoneNumber,
                                isConnected: true,
                                lastSyncedAt: new Date(),
                            },
                        })

                        if (session.adminSocket && session.adminSocket.readyState === WebSocket.OPEN) {
                            sendJson(session.adminSocket, {
                                code: 0,
                                msg: "Pairing completed",
                                data: {
                                    step: 2,
                                    whatsappNumber: normalizeWhatsappNumber(whatsappNumber),
                                },
                            })
                        }

                        sendJson(socket, { code: 0, msg: "Pairing completed", data: { step: 2 } })
                    } catch (error) {
                        console.error("Failed to persist WhatsApp number", error)
                        sendJson(socket, { code: -1, msg: "Unable to save WhatsApp number" })
                        if (session.adminSocket && session.adminSocket.readyState === WebSocket.OPEN) {
                            sendJson(session.adminSocket, { code: -1, msg: "Unable to save WhatsApp number" })
                        }
                    } finally {
                        cleanupSession(payload.token)
                    }
                }
            }
        })
    })

    setInterval(() => {
        const now = Date.now()
        for (const [token, session] of sessions.entries()) {
            if (now - session.createdAt > SESSION_TTL_MS) {
                if (session.adminSocket && session.adminSocket.readyState === WebSocket.OPEN) {
                    sendJson(session.adminSocket, { code: -1, msg: "Pairing expired" })
                    session.adminSocket.close()
                }
                if (session.phoneSocket && session.phoneSocket.readyState === WebSocket.OPEN) {
                    sendJson(session.phoneSocket, { code: -1, msg: "Pairing expired" })
                    session.phoneSocket.close()
                }
                cleanupSession(token)
            }
        }
    }, 30_000)

    return server
}

const sendJson = (socket: WebSocket, payload: unknown) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload))
    }
}

const cleanupSession = (token: string) => {
    const session = sessions.get(token)
    if (!session) {
        return
    }

    sessions.delete(token)

    if (session.adminSocket) {
        socketToToken.delete(session.adminSocket)
    }

    if (session.phoneSocket) {
        socketToToken.delete(session.phoneSocket)
    }
}

const normalizeWhatsappNumber = (record: Awaited<ReturnType<typeof prisma.companyWhatsappNumber.upsert>>) => ({
    id: record.id,
    companyId: record.companyId,
    displayName: record.displayName,
    phoneNumber: record.phoneNumber,
    isConnected: record.isConnected,
    messagesThisMonth: record.messagesThisMonth,
    lastSyncedAt: record.lastSyncedAt ? record.lastSyncedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
})

const server = createHttpServer()

server.listen(port, () => {
    const address = server.address() as AddressInfo | null
    console.log(
        `WS pairing server listening on ${address ? `${address.address}:${address.port}` : port} (pairing base ${pairingBaseUrl})`,
    )
})

const shutdown = async () => {
    for (const session of sessions.values()) {
        if (session.adminSocket && session.adminSocket.readyState === WebSocket.OPEN) {
            sendJson(session.adminSocket, { code: -1, msg: "Server shutting down" })
            session.adminSocket.close()
        }
        if (session.phoneSocket && session.phoneSocket.readyState === WebSocket.OPEN) {
            sendJson(session.phoneSocket, { code: -1, msg: "Server shutting down" })
            session.phoneSocket.close()
        }
    }
    sessions.clear()
    server.close(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

console.log("qr-socket runtime", { node: process.versions.node, env: process.env.NODE_ENV })

