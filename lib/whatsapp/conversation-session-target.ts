import type { WhatsAppSession } from "@/lib/whatsapp/types"

export const pickConnectedSessionTarget = (
  sessions: WhatsAppSession[],
  preferredSessionId?: string,
): string | null => {
  const connected = sessions.filter((session) => session.status === "connected" && session.phoneNumber)
  if (connected.length === 0) {
    return null
  }

  if (
    preferredSessionId &&
    connected.some((session) => session.sessionId === preferredSessionId)
  ) {
    return preferredSessionId
  }

  if (connected.length === 1) {
    return connected[0]!.sessionId
  }

  return null
}
