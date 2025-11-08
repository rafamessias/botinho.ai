import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"

const connectionStatusWebhookSchema = z.object({
    phoneNumber: z.string(),
    status: z.enum(["need_scan", "authenticated", "connected", "disconnected", "auth_failure"]),
    displayName: z.string().optional(),
    token: z.string(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log("WhatsApp connection status webhook received:", JSON.stringify(body, null, 2))

        const payload = connectionStatusWebhookSchema.parse(body)

        // Validate internal token from Authorization header before processing
        const expectedToken = process.env.WHATSAPP_CONNECTION_WEBHOOK_TOKEN || ""
        const authHeader = request.headers.get("Authorization")
        if (!authHeader) {
            console.error("Authorization header not found")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (authHeader !== expectedToken) {
            console.error("Invalid authorization header provided")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const sessionAssignment = await prisma.sessionAssignment.findFirst({
            where: {
                phoneNumber: payload.phoneNumber,
            },
        })

        if (!sessionAssignment) {
            console.error(`WhatsApp number not found for phone ${payload.phoneNumber}`)
            return NextResponse.json({ error: "WhatsApp number not found" }, { status: 404 })
        }

        // Determine connection status based on status value
        const isConnected = payload.status === "connected"

        // Update the WhatsApp number status
        const updatedSessionAssignment = await prisma.sessionAssignment.update({
            where: { id: sessionAssignment.id },
            data: {
                isConnected,
                status: payload.status,
                ...(payload.displayName && { displayName: payload.displayName }),
            },
        })

        console.log(
            `WhatsApp number ${payload.phoneNumber} status updated to ${payload.status} for company ${sessionAssignment.companyId}`,
        )

        return NextResponse.json({
            success: true,
            whatsappNumberId: updatedSessionAssignment.id,
            status: updatedSessionAssignment.status,
            isConnected: updatedSessionAssignment.isConnected,
        })
    } catch (error) {
        console.error("Error processing WhatsApp connection status webhook:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid payload", details: error.errors },
                { status: 400 },
            )
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

