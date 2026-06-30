import type { ReactNode } from "react"
import {
  Bot,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Link2,
  Lock,
  MessageSquare,
  Shield,
  StickyNote,
  UserCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type FeatureKey =
  | "humanFriendly"
  | "secure"
  | "collaboration"
  | "appointments"
  | "integrations"
  | "playbooks"

export type FeatureIconKey = "bot" | "shield" | "users" | "calendarCheck" | "zap" | "checkCircle2"

export type FeatureMocks = {
  humanFriendly: {
    configLabel: string
    promptSnippet: string
    customerLabel: string
    customerMessage: string
    botLabel: string
    botReply: string
  }
  secure: {
    encryptionLabel: string
    encryptionStatus: string
    rolesLabel: string
    roles: { name: string; access: string }[]
    compliance: string
  }
  collaboration: {
    assignmentLabel: string
    assignedTo: string
    internalNoteLabel: string
    note: string
    customerLabel: string
    customerMessage: string
    agentLabel: string
    agentReply: string
  }
  appointments: {
    eventLabel: string
    event: string
    autoLabel: string
    reminder: string
  }
  integrations: {
    connectedLabel: string
    whatsapp: string
    whatsappStatus: string
    calendar: string
    calendarStatus: string
    webhook: string
    webhookStatus: string
  }
  playbooks: {
    templatesLabel: string
    template1: string
    template2: string
    previewLabel: string
    composed: string
  }
}

export type LandingFeature = {
  key: FeatureKey
  title: string
  description: string
  icon: FeatureIconKey
}

const featureIconMap = {
  bot: Bot,
  shield: Shield,
  users: Users,
  calendarCheck: CalendarCheck,
  zap: Zap,
  checkCircle2: CheckCircle2,
} satisfies Record<FeatureIconKey, LucideIcon>

type LandingFeaturesSectionProps = {
  features: LandingFeature[]
  mocks: FeatureMocks
}

const MockShell = ({ children }: { children: ReactNode }) => (
  <div className="h-[220px] overflow-hidden border-b border-border/60 bg-secondary/40 p-3">
    {children}
  </div>
)

const MockCaption = ({ children }: { children: ReactNode }) => (
  <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>
)

const CustomerBubble = ({ children }: { children: ReactNode }) => (
  <div className="max-w-[92%] rounded-lg border border-border bg-card px-2 py-1.5 text-[10px] leading-snug text-foreground">
    {children}
  </div>
)

const OutboundBubble = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="ml-auto max-w-[92%] rounded-lg border border-primary/20 bg-primary/5 px-2 py-1.5 text-[10px] leading-snug text-foreground">
    <span className="mb-0.5 flex items-center gap-1 text-[9px] font-medium text-primary">{label}</span>
    {children}
  </div>
)

const HumanFriendlyMock = ({ labels }: { labels: FeatureMocks["humanFriendly"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2.5">
      <div className="rounded-lg border border-dashed border-primary/30 bg-background p-2">
        <MockCaption>{labels.configLabel}</MockCaption>
        <p className="mt-1 text-[10px] leading-snug text-foreground">{labels.promptSnippet}</p>
      </div>
      <div className="mt-auto space-y-1.5">
        <CustomerBubble>
          <span className="mb-0.5 block text-[9px] font-medium text-muted-foreground">
            {labels.customerLabel}
          </span>
          {labels.customerMessage}
        </CustomerBubble>
        <OutboundBubble label={labels.botLabel}>{labels.botReply}</OutboundBubble>
      </div>
    </div>
  </MockShell>
)

const SecureMock = ({ labels }: { labels: FeatureMocks["secure"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
          <Shield className="size-3.5 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <MockCaption>{labels.encryptionLabel}</MockCaption>
          <p className="text-[10px] font-medium text-foreground">{labels.encryptionStatus}</p>
        </div>
        <Lock className="size-3.5 shrink-0 text-success" aria-hidden />
      </div>

      <div className="min-h-0 flex-1 rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.rolesLabel}</MockCaption>
        <div className="mt-1.5 space-y-1">
          {labels.roles.map((role) => (
            <div key={role.name} className="flex items-center justify-between gap-2 text-[10px]">
              <Badge variant="secondary" className="px-1.5 py-0 font-normal">
                {role.name}
              </Badge>
              <span className="truncate text-muted-foreground">{role.access}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] font-medium text-primary">{labels.compliance}</p>
    </div>
  </MockShell>
)

const CollaborationMock = ({ labels }: { labels: FeatureMocks["collaboration"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <div className="rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.assignmentLabel}</MockCaption>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <UserCheck className="size-3 text-primary" aria-hidden />
          {labels.assignedTo}
        </div>
      </div>

      <div className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1.5">
        <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          <StickyNote className="size-2.5" aria-hidden />
          {labels.internalNoteLabel}
        </div>
        <p className="mt-0.5 text-[10px] leading-snug text-foreground">{labels.note}</p>
      </div>

      <div className="mt-auto space-y-1.5">
        <CustomerBubble>
          <span className="mb-0.5 block text-[9px] font-medium text-muted-foreground">
            {labels.customerLabel}
          </span>
          {labels.customerMessage}
        </CustomerBubble>
        <OutboundBubble label={labels.agentLabel}>{labels.agentReply}</OutboundBubble>
      </div>
    </div>
  </MockShell>
)

const AppointmentsMock = ({ labels }: { labels: FeatureMocks["appointments"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-2">
        <MockCaption>{labels.eventLabel}</MockCaption>
        <div className="mt-1 flex items-center gap-2">
          <CalendarCheck className="size-3.5 text-primary" aria-hidden />
          <span className="text-[10px] font-medium text-foreground">{labels.event}</span>
          <CheckCircle2 className="ml-auto size-3.5 text-success" aria-hidden />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 py-0.5">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
          {labels.autoLabel}
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      <OutboundBubble label="botinho">
        <MessageSquare className="mb-0.5 inline size-2.5 text-primary" aria-hidden />
        {labels.reminder}
      </OutboundBubble>
    </div>
  </MockShell>
)

const IntegrationsMock = ({ labels }: { labels: FeatureMocks["integrations"] }) => {
  const rows = [
    { icon: MessageSquare, name: labels.whatsapp, status: labels.whatsappStatus },
    { icon: Calendar, name: labels.calendar, status: labels.calendarStatus },
    { icon: Link2, name: labels.webhook, status: labels.webhookStatus },
  ]

  return (
    <MockShell>
      <div className="flex h-full flex-col gap-2">
        <MockCaption>{labels.connectedLabel}</MockCaption>
        <div className="space-y-1.5">
          {rows.map((row) => {
            const RowIcon = row.icon

            return (
              <div
                key={row.name}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                  <RowIcon className="size-3 text-primary" aria-hidden />
                </div>
                <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-foreground">
                  {row.name}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden />
                  {row.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </MockShell>
  )
}

const PlaybooksMock = ({ labels }: { labels: FeatureMocks["playbooks"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <MockCaption>{labels.templatesLabel}</MockCaption>
      <div className="space-y-1">
        <div className="rounded-md border border-border/60 bg-background px-2 py-1.5 text-[10px] text-muted-foreground">
          {labels.template1}
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-1.5 text-[10px] font-medium text-foreground">
          <Zap className="size-3 shrink-0 text-primary" aria-hidden />
          {labels.template2}
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.previewLabel}</MockCaption>
        <p className="mt-1 text-[10px] leading-snug text-foreground">{labels.composed}</p>
      </div>
    </div>
  </MockShell>
)

const FeatureMock = ({ featureKey, mocks }: { featureKey: FeatureKey; mocks: FeatureMocks }) => {
  switch (featureKey) {
    case "humanFriendly":
      return <HumanFriendlyMock labels={mocks.humanFriendly} />
    case "secure":
      return <SecureMock labels={mocks.secure} />
    case "collaboration":
      return <CollaborationMock labels={mocks.collaboration} />
    case "appointments":
      return <AppointmentsMock labels={mocks.appointments} />
    case "integrations":
      return <IntegrationsMock labels={mocks.integrations} />
    case "playbooks":
      return <PlaybooksMock labels={mocks.playbooks} />
  }
}

export const LandingFeaturesSection = ({ features, mocks }: LandingFeaturesSectionProps) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {features.map((feature) => {
      const FeatureIcon = featureIconMap[feature.icon]

      return (
        <Card
          key={feature.key}
          className="overflow-hidden rounded-2xl border border-primary/10 bg-background/90 shadow-sm"
        >
          <FeatureMock featureKey={feature.key} mocks={mocks} />
          <CardHeader className="gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FeatureIcon className="size-6" aria-hidden />
            </span>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      )
    })}
  </div>
)
