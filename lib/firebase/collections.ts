/** Firestore collection and subcollection path helpers */

export const collections = {
  users: "users",
  plans: "plans",
  companies: "companies",
  pendingSignups: "pendingSignups",
} as const

export const companySubcollections = {
  members: "members",
  settings: "settings",
  aiAgents: "aiAgents",
  knowledge: "knowledge",
  quickAnswers: "quickAnswers",
  templates: "templates",
  customers: "customers",
  conversations: "conversations",
  subscription: "subscription",
  usage: "usage",
  inboundEvents: "inboundEvents",
  channelUsage: "channelUsage",
  messageDedupe: "messageDedupe",
  surveys: "surveys",
  surveyResponses: "surveyResponses",
  campaigns: "campaigns",
  campaignDeliveries: "campaignDeliveries",
} as const

export const conversationSubcollections = {
  messages: "messages",
} as const

export const aiAgentSubcollections = {
  knowledge: "knowledge",
  quickAnswers: "quickAnswers",
  templates: "templates",
} as const

export const settingsDocIds = {
  default: "default",
} as const

export const subscriptionDocIds = {
  current: "current",
} as const
