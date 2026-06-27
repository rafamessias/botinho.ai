#!/usr/bin/env node
/**
 * One-off diagnostic: WhatsApp sessions/messages + inbox conversations.
 * Usage: node scripts/diagnose-inbox-pipeline.mjs
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const envPath = resolve(process.cwd(), ".env")
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eq = trimmed.indexOf("=")
  if (eq === -1) continue
  const key = trimmed.slice(0, eq)
  let val = trimmed.slice(eq + 1)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  if (!process.env[key]) process.env[key] = val
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app")
const { getFirestore } = await import("firebase-admin/firestore")

if (getApps().length === 0) {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!json) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT_JSON")
    process.exit(1)
  }
  initializeApp({ credential: cert(JSON.parse(json)) })
}

const db = getFirestore()

console.log("=== WhatsApp sessions (top-level /sessions) ===")
const sessionsSnap = await db.collection("sessions").limit(10).get()
if (sessionsSnap.empty) {
  console.log("(none)")
} else {
  for (const doc of sessionsSnap.docs) {
    const d = doc.data()
    console.log({
      id: doc.id,
      companyId: d.companyId,
      status: d.status,
      phoneNumber: d.phoneNumber,
      webhookUrl: d.webhookUrl ?? "(missing)",
    })
  }
}

console.log("\n=== Worker messages (top-level /messages, latest 10) ===")
const workerMsgs = await db.collection("messages").orderBy("timestamp", "desc").limit(10).get()
if (workerMsgs.empty) {
  console.log("(none — worker may not be receiving WhatsApp events)")
} else {
  for (const doc of workerMsgs.docs) {
    const d = doc.data()
    console.log({
      id: doc.id,
      sessionId: d.sessionId,
      direction: d.direction,
      from: d.from,
      body: String(d.body ?? "").slice(0, 80),
      timestamp: d.timestamp?.toDate?.()?.toISOString?.() ?? d.timestamp,
    })
  }
}

console.log("\n=== Inbox conversations (companies/*/conversations, latest 10) ===")
const companiesSnap = await db.collection("companies").limit(5).get()
let convCount = 0
for (const companyDoc of companiesSnap.docs) {
  const convSnap = await companyDoc.ref
    .collection("conversations")
    .orderBy("lastMessageSentAt", "desc")
    .limit(5)
    .get()
  for (const conv of convSnap.docs) {
    convCount++
    const d = conv.data()
    const msgSnap = await conv.ref.collection("messages").orderBy("sentAt", "desc").limit(3).get()
    console.log({
      companyId: companyDoc.id,
      conversationId: conv.id,
      sessionId: d.sessionId ?? null,
      lastMessagePreview: d.lastMessagePreview,
      unreadCount: d.unreadCount,
      messageCount: msgSnap.size,
      recentMessages: msgSnap.docs.map((m) => ({
        senderType: m.data().senderType,
        content: String(m.data().content ?? "").slice(0, 60),
      })),
    })
  }
}
console.log("\n=== Inbound events (companies/*/inboundEvents, latest 10) ===")
let eventCount = 0
for (const companyDoc of companiesSnap.docs) {
  const eventsSnap = await companyDoc.ref
    .collection("inboundEvents")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get()
  for (const event of eventsSnap.docs) {
    eventCount++
    const d = event.data()
    console.log({
      companyId: companyDoc.id,
      eventId: event.id,
      status: d.status,
      from: d.from,
      body: String(d.body ?? "").slice(0, 60),
      conversationId: d.conversationId ?? null,
      inboxMessageId: d.inboxMessageId ?? null,
    })
  }
}
if (eventCount === 0) console.log("(none — worker is not writing inboundEvents)")
