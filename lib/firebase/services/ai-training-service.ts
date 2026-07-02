import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { AiTemplateCategory, KnowledgeItemType } from "@/lib/types/enums"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)
const toDate = (value: Timestamp) => value.toDate()

const knowledgeRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.knowledge)
const quickAnswersRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.quickAnswers)
const templatesRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.templates)

const mapKnowledgeDocs = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) =>
  docs.map((doc) => {
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
  })

const mapQuickAnswerDocs = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) =>
  docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title as string,
      content: data.content as string,
      createdAt: toDate(data.createdAt as Timestamp),
      updatedAt: toDate(data.updatedAt as Timestamp),
    }
  })

const mapTemplateDocs = async (docs: FirebaseFirestore.QueryDocumentSnapshot[]) =>
  Promise.all(
    docs.map(async (doc) => {
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

export const listAiTrainingData = async (companyId: string) => {
  const [knowledgeSnap, quickSnap, templateSnap] = await Promise.all([
    knowledgeRef(companyId).orderBy("createdAt", "desc").get(),
    quickAnswersRef(companyId).orderBy("createdAt", "desc").get(),
    templatesRef(companyId).orderBy("createdAt", "desc").get(),
  ])

  return {
    knowledgeBase: mapKnowledgeDocs(knowledgeSnap.docs),
    quickAnswers: mapQuickAnswerDocs(quickSnap.docs),
    templates: await mapTemplateDocs(templateSnap.docs),
  }
}

export const listInboxReplyResources = async (companyId: string) => {
  const [quickSnap, templateSnap] = await Promise.all([
    quickAnswersRef(companyId).orderBy("createdAt", "desc").get(),
    templatesRef(companyId).orderBy("createdAt", "desc").get(),
  ])

  return {
    quickAnswers: mapQuickAnswerDocs(quickSnap.docs),
    templates: await mapTemplateDocs(templateSnap.docs),
  }
}

export const createKnowledgeItem = async (
  companyId: string,
  userId: string,
  input: { title: string; content: string; type: KnowledgeItemType; urlSummary?: string },
) => {
  const ref = knowledgeRef(companyId).doc()
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

export const updateKnowledgeItem = async (
  companyId: string,
  id: string,
  input: { title: string; content: string; type: KnowledgeItemType; urlSummary?: string },
) => {
  const ref = knowledgeRef(companyId).doc(id)
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

export const deleteKnowledgeItem = async (companyId: string, id: string) => {
  await knowledgeRef(companyId).doc(id).delete()
}

export const createQuickAnswer = async (companyId: string, userId: string, content: string) => {
  const ref = quickAnswersRef(companyId).doc()
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

export const updateQuickAnswer = async (companyId: string, id: string, content: string) => {
  const ref = quickAnswersRef(companyId).doc(id)
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

export const deleteQuickAnswer = async (companyId: string, id: string) => {
  await quickAnswersRef(companyId).doc(id).delete()
}

export const createAiTemplate = async (
  companyId: string,
  userId: string,
  input: {
    name: string
    content: string
    category: AiTemplateCategory
    options?: Array<{ label: string; value: string }>
  },
) => {
  const ref = templatesRef(companyId).doc()
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

  const data = await listAiTrainingData(companyId)
  return data.templates.find((template) => template.id === ref.id)!
}

export const updateAiTemplate = async (
  companyId: string,
  id: string,
  input: {
    name: string
    content: string
    category: AiTemplateCategory
    options?: Array<{ label: string; value: string }>
  },
) => {
  const ref = templatesRef(companyId).doc(id)
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

  const data = await listAiTrainingData(companyId)
  return data.templates.find((template) => template.id === id)!
}

export const deleteAiTemplate = async (companyId: string, id: string) => {
  const ref = templatesRef(companyId).doc(id)
  const optionsSnap = await ref.collection("options").get()
  const batch = adminDb.batch()
  optionsSnap.docs.forEach((doc) => batch.delete(doc.ref))
  batch.delete(ref)
  await batch.commit()
}
