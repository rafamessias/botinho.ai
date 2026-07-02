export const buildInboundEventId = (sessionId: string, messageId: string) =>
  `whatsapp_${sessionId}_${messageId}`.replace(/[/\\#?]/g, "_")
