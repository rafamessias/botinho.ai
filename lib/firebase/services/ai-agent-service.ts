import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { aiAgentSubcollections, collections, companySubcollections } from "@/lib/firebase/collections"
import { AiTemplateCategory, KnowledgeItemType } from "@/lib/types/enums"
import { listAiTrainingData } from "@/lib/firebase/services/ai-training-service"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)
const toDate = (value: Timestamp) => value.toDate()

const agentsRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.aiAgents)

const agentRef = (companyId: string, agentId: string) => agentsRef(companyId).doc(agentId)

const knowledgeRef = (companyId: string, agentId: string) =>
  agentRef(companyId, agentId).collection(aiAgentSubcollections.knowledge)

const quickAnswersRef = (companyId: string, agentId: string) =>
  agentRef(companyId, agentId).collection(aiAgentSubcollections.quickAnswers)

const templatesRef = (companyId: string, agentId: string) =>
  agentRef(companyId, agentId).collection(aiAgentSubcollections.templates)

export type AiAgentRecord = {
  id: string
  name: string
  systemPrompt: string
  sessionIds: string[]
  autoReply: boolean
  createdAt: Date
  updatedAt: Date
}

const normalizeSessionIds = (data: FirebaseFirestore.DocumentData): string[] => {
  const sessionIds = data.sessionIds
  if (Array.isArray(sessionIds)) {
    return [...new Set(sessionIds.filter((id): id is string => typeof id === "string" && id.length > 0))]
  }

  const legacySessionId = data.sessionId
  return typeof legacySessionId === "string" && legacySessionId.length > 0 ? [legacySessionId] : []
}

const mapAgent = (id: string, data: FirebaseFirestore.DocumentData): AiAgentRecord => ({
  id,
  name: data.name as string,
  systemPrompt: (data.systemPrompt as string) ?? "",
  sessionIds: normalizeSessionIds(data),
  autoReply: data.autoReply !== false,
  createdAt: toDate(data.createdAt as Timestamp),
  updatedAt: toDate(data.updatedAt as Timestamp),
})

const copyLegacyTrainingToAgent = async (companyId: string, agentId: string, userId: string) => {
  const legacy = await listAiTrainingData(companyId)
  const batch = adminDb.batch()
  const now = FieldValue.serverTimestamp()

  for (const item of legacy.knowledgeBase) {
    const ref = knowledgeRef(companyId, agentId).doc()
    batch.set(ref, {
      type: item.type,
      title: item.title,
      content: item.content,
      urlSummary: item.urlSummary,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    })
  }

  for (const item of legacy.quickAnswers) {
    const ref = quickAnswersRef(companyId, agentId).doc()
    batch.set(ref, {
      title: item.title,
      content: item.content,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    })
  }

  for (const template of legacy.templates) {
    const ref = templatesRef(companyId, agentId).doc()
    batch.set(ref, {
      name: template.name,
      content: template.content,
      category: template.category,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    })
    for (const option of template.options ?? []) {
      batch.set(ref.collection("options").doc(), {
        label: option.label,
        value: option.value,
        createdAt: now,
      })
    }
  }

  if (
    legacy.knowledgeBase.length > 0 ||
    legacy.quickAnswers.length > 0 ||
    legacy.templates.length > 0
  ) {
    await batch.commit()
  }
}

const ensureAgentsExist = async (companyId: string, userId: string) => {
  const snap = await agentsRef(companyId).limit(1).get()
  if (!snap.empty) {
    return
  }

  const ref = agentsRef(companyId).doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({
    name: "Default Agent",
    systemPrompt: "",
    sessionIds: [],
    autoReply: true,
    createdById: userId,
    createdAt: now,
    updatedAt: now,
  })

  await copyLegacyTrainingToAgent(companyId, ref.id, userId)
}

export const listAiAgents = async (companyId: string, userId: string) => {
  await ensureAgentsExist(companyId, userId)

  const snap = await agentsRef(companyId).orderBy("createdAt", "asc").get()
  return snap.docs.map((doc) => mapAgent(doc.id, doc.data()))
}

export const getAiAgent = async (companyId: string, agentId: string) => {
  const snap = await agentRef(companyId, agentId).get()
  if (!snap.exists) {
    return null
  }
  return mapAgent(snap.id, snap.data()!)
}

export const getAiAgentBySessionId = async (companyId: string, sessionId: string) => {
  const bySessionIds = await agentsRef(companyId)
    .where("sessionIds", "array-contains", sessionId)
    .limit(1)
    .get()
  if (!bySessionIds.empty) {
    const doc = bySessionIds.docs[0]!
    return mapAgent(doc.id, doc.data())
  }

  const byLegacySessionId = await agentsRef(companyId).where("sessionId", "==", sessionId).limit(1).get()
  if (byLegacySessionId.empty) {
    return null
  }
  const doc = byLegacySessionId.docs[0]!
  return mapAgent(doc.id, doc.data())
}

export const createAiAgent = async (
  companyId: string,
  userId: string,
  input: { name: string; systemPrompt?: string; sessionIds?: string[]; autoReply?: boolean },
) => {
  const sessionIds = input.sessionIds ?? []
  if (sessionIds.length > 0) {
    await clearSessionsFromOtherAgents(companyId, sessionIds)
  }

  const ref = agentsRef(companyId).doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({
    name: input.name,
    systemPrompt: input.systemPrompt ?? "",
    sessionIds,
    autoReply: input.autoReply !== false,
    createdById: userId,
    createdAt: now,
    updatedAt: now,
  })

  const data = (await ref.get()).data()!
  return mapAgent(ref.id, data)
}

export const updateAiAgent = async (
  companyId: string,
  agentId: string,
  input: {
    name?: string
    systemPrompt?: string
    sessionIds?: string[]
    autoReply?: boolean
  },
) => {
  const ref = agentRef(companyId, agentId)
  if (!(await ref.get()).exists) {
    throw new Error("AI agent not found")
  }

  if (input.sessionIds !== undefined && input.sessionIds.length > 0) {
    await clearSessionsFromOtherAgents(companyId, input.sessionIds, agentId)
  }

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
  if (input.name !== undefined) update.name = input.name
  if (input.systemPrompt !== undefined) update.systemPrompt = input.systemPrompt
  if (input.sessionIds !== undefined) {
    update.sessionIds = input.sessionIds
    update.sessionId = FieldValue.delete()
  }
  if (input.autoReply !== undefined) update.autoReply = input.autoReply

  await ref.update(update)
  const data = (await ref.get()).data()!
  return mapAgent(agentId, data)
}

export const deleteAiAgent = async (companyId: string, agentId: string) => {
  const ref = agentRef(companyId, agentId)
  if (!(await ref.get()).exists) {
    throw new Error("AI agent not found")
  }

  const agentsCount = (await agentsRef(companyId).count().get()).data().count
  if (agentsCount <= 1) {
    throw new Error("Cannot delete the last AI agent")
  }

  const [knowledgeSnap, quickSnap, templateSnap] = await Promise.all([
    knowledgeRef(companyId, agentId).get(),
    quickAnswersRef(companyId, agentId).get(),
    templatesRef(companyId, agentId).get(),
  ])

  const batch = adminDb.batch()
  for (const doc of knowledgeSnap.docs) batch.delete(doc.ref)
  for (const doc of quickSnap.docs) batch.delete(doc.ref)
  for (const templateDoc of templateSnap.docs) {
    const optionsSnap = await templateDoc.ref.collection("options").get()
    optionsSnap.docs.forEach((optionDoc) => batch.delete(optionDoc.ref))
    batch.delete(templateDoc.ref)
  }
  batch.delete(ref)
  await batch.commit()
}

const clearSessionsFromOtherAgents = async (
  companyId: string,
  sessionIds: string[],
  excludeAgentId?: string,
) => {
  for (const sessionId of sessionIds) {
    await clearSessionFromOtherAgents(companyId, sessionId, excludeAgentId)
  }
}

const clearSessionFromOtherAgents = async (
  companyId: string,
  sessionId: string,
  excludeAgentId?: string,
) => {
  const [bySessionIds, byLegacySessionId] = await Promise.all([
    agentsRef(companyId).where("sessionIds", "array-contains", sessionId).get(),
    agentsRef(companyId).where("sessionId", "==", sessionId).get(),
  ])

  const docs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>()
  bySessionIds.docs.forEach((doc) => docs.set(doc.id, doc))
  byLegacySessionId.docs.forEach((doc) => docs.set(doc.id, doc))

  const batch = adminDb.batch()
  let hasUpdates = false

  for (const doc of docs.values()) {
    if (excludeAgentId && doc.id === excludeAgentId) continue

    const currentSessionIds = normalizeSessionIds(doc.data())
    const nextSessionIds = currentSessionIds.filter((id) => id !== sessionId)

    batch.update(doc.ref, {
      sessionIds: nextSessionIds,
      sessionId: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    hasUpdates = true
  }

  if (hasUpdates) {
    await batch.commit()
  }
}

export const listAgentTrainingData = async (companyId: string, agentId: string) => {
  const [knowledgeSnap, quickSnap, templateSnap] = await Promise.all([
    knowledgeRef(companyId, agentId).orderBy("createdAt", "desc").get(),
    quickAnswersRef(companyId, agentId).orderBy("createdAt", "desc").get(),
    templatesRef(companyId, agentId).orderBy("createdAt", "desc").get(),
  ])

  const templates = await Promise.all(
    templateSnap.docs.map(async (doc) => {
      const optionsSnap = await doc.ref.collection("options").orderBy("createdAt", "asc").get()
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name as string,
        content: data.content as string,
        category: data.category as AiTemplateCategory,
        createdAt: toDate(data.createdAt as Timestamp),
        updatedAt: toDate(data.updatedAt as Timestamp),
        options: optionsSnap.docs.map((optionDoc) => ({
          id: optionDoc.id,
          label: optionDoc.data().label as string,
          value: optionDoc.data().value as string,
        })),
      }
    }),
  )

  return {
    knowledgeBase: knowledgeSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        type: data.type as KnowledgeItemType,
        title: data.title as string,
        content: data.content as string,
        urlSummary: data.urlSummary as string | undefined,
        createdAt: toDate(data.createdAt as Timestamp),
        updatedAt: toDate(data.updatedAt as Timestamp),
      }
    }),
    quickAnswers: quickSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title as string,
        content: data.content as string,
        createdAt: toDate(data.createdAt as Timestamp),
        updatedAt: toDate(data.updatedAt as Timestamp),
      }
    }),
    templates,
  }
}

export const createAgentKnowledgeItem = async (
  companyId: string,
  agentId: string,
  userId: string,
  input: { title: string; content: string; type: KnowledgeItemType; urlSummary?: string },
) => {
  const ref = knowledgeRef(companyId, agentId).doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({
    ...input,
    createdById: userId,
    createdAt: now,
    updatedAt: now,
  })
  const data = (await ref.get()).data()!
  return {
    id: ref.id,
    type: input.type,
    title: input.title,
    content: input.content,
    urlSummary: input.urlSummary,
    createdAt: toDate(data.createdAt as Timestamp),
    updatedAt: toDate(data.updatedAt as Timestamp),
  }
}

export const updateAgentKnowledgeItem = async (
  companyId: string,
  agentId: string,
  id: string,
  input: { title: string; content: string; type: KnowledgeItemType; urlSummary?: string },
) => {
  const ref = knowledgeRef(companyId, agentId).doc(id)
  if (!(await ref.get()).exists) {
    throw new Error("Knowledge item not found")
  }
  await ref.update({ ...input, updatedAt: FieldValue.serverTimestamp() })
  const data = (await ref.get()).data()!
  return {
    id,
    type: data.type as KnowledgeItemType,
    title: data.title as string,
    content: data.content as string,
    urlSummary: data.urlSummary as string | undefined,
    createdAt: toDate(data.createdAt as Timestamp),
    updatedAt: toDate(data.updatedAt as Timestamp),
  }
}

export const deleteAgentKnowledgeItem = async (companyId: string, agentId: string, id: string) => {
  await knowledgeRef(companyId, agentId).doc(id).delete()
}

export const createAgentQuickAnswer = async (
  companyId: string,
  agentId: string,
  userId: string,
  content: string,
) => {
  const ref = quickAnswersRef(companyId, agentId).doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({ title: content, content, createdById: userId, createdAt: now, updatedAt: now })
  const data = (await ref.get()).data()!
  return {
    id: ref.id,
    title: content,
    content,
    createdAt: toDate(data.createdAt as Timestamp),
    updatedAt: toDate(data.updatedAt as Timestamp),
  }
}

export const updateAgentQuickAnswer = async (
  companyId: string,
  agentId: string,
  id: string,
  content: string,
) => {
  const ref = quickAnswersRef(companyId, agentId).doc(id)
  if (!(await ref.get()).exists) {
    throw new Error("Quick answer not found")
  }
  await ref.update({ title: content, content, updatedAt: FieldValue.serverTimestamp() })
  const data = (await ref.get()).data()!
  return {
    id,
    title: content,
    content,
    createdAt: toDate(data.createdAt as Timestamp),
    updatedAt: toDate(data.updatedAt as Timestamp),
  }
}

export const deleteAgentQuickAnswer = async (companyId: string, agentId: string, id: string) => {
  await quickAnswersRef(companyId, agentId).doc(id).delete()
}

export const createAgentTemplate = async (
  companyId: string,
  agentId: string,
  userId: string,
  input: {
    name: string
    content: string
    category: AiTemplateCategory
    options?: Array<{ label: string; value: string }>
  },
) => {
  const ref = templatesRef(companyId, agentId).doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({
    name: input.name,
    content: input.content,
    category: input.category,
    createdById: userId,
    createdAt: now,
    updatedAt: now,
  })

  if (input.options?.length) {
    const batch = adminDb.batch()
    for (const option of input.options) {
      batch.set(ref.collection("options").doc(), { ...option, createdAt: now })
    }
    await batch.commit()
  }

  const data = await listAgentTrainingData(companyId, agentId)
  return data.templates.find((template) => template.id === ref.id)!
}

export const updateAgentTemplate = async (
  companyId: string,
  agentId: string,
  id: string,
  input: {
    name: string
    content: string
    category: AiTemplateCategory
    options?: Array<{ label: string; value: string }>
  },
) => {
  const ref = templatesRef(companyId, agentId).doc(id)
  if (!(await ref.get()).exists) {
    throw new Error("Template not found")
  }

  await ref.update({
    name: input.name,
    content: input.content,
    category: input.category,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const optionsSnap = await ref.collection("options").get()
  const batch = adminDb.batch()
  optionsSnap.docs.forEach((doc) => batch.delete(doc.ref))
  if (input.options?.length) {
    const now = FieldValue.serverTimestamp()
    for (const option of input.options) {
      batch.set(ref.collection("options").doc(), { ...option, createdAt: now })
    }
  }
  await batch.commit()

  const data = await listAgentTrainingData(companyId, agentId)
  return data.templates.find((template) => template.id === id)!
}

export const deleteAgentTemplate = async (companyId: string, agentId: string, id: string) => {
  const ref = templatesRef(companyId, agentId).doc(id)
  const optionsSnap = await ref.collection("options").get()
  const batch = adminDb.batch()
  optionsSnap.docs.forEach((doc) => batch.delete(doc.ref))
  batch.delete(ref)
  await batch.commit()
}

export const isAgentAutoReplyEnabled = async (params: {
  companyId: string
  sessionId?: string | null
}): Promise<boolean> => {
  if (!params.sessionId) {
    const settingsSnap = await companyRef(params.companyId)
      .collection(companySubcollections.settings)
      .doc("default")
      .get()
    return settingsSnap.data()?.autoReply !== false
  }

  const agent = await getAiAgentBySessionId(params.companyId, params.sessionId)
  if (agent) {
    return agent.autoReply
  }

  const settingsSnap = await companyRef(params.companyId)
    .collection(companySubcollections.settings)
    .doc("default")
    .get()
  return settingsSnap.data()?.autoReply !== false
}
