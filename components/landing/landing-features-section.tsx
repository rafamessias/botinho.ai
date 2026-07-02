import type { ReactNode } from "react"
import {
  Bot,
  CheckCircle2,
  Lock,
  Megaphone,
  MessageSquare,
  Shield,
  Smartphone,
  UserCheck,
  Zap,
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
  | "campaigns"
  | "whatsapp"
  | "templates"

export type FeatureIconKey =
  | "bot"
  | "shield"
  | "users"
  | "megaphone"
  | "smartphone"
  | "checkCircle2"

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
    statusLabel: string
    statusValue: string
    customerLabel: string
    customerMessage: string
    agentLabel: string
    agentReply: string
  }
  campaigns: {
    campaignLabel: string
    campaignName: string
    audienceLabel: string
    audienceTags: string
    messageLabel: string
    messagePreview: string
    metricsLabel: string
    metricsValue: string
  }
  whatsapp: {
    connectionLabel: string
    phoneNumber: string
    statusConnected: string
    qrHint: string
    inboundLabel: string
    inboundStatus: string
  }
  templates: {
    quickRepliesLabel: string
    quickReply1: string
    quickReply2: string
    templateLabel: string
    templateName: string
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

type LandingFeaturesSectionProps = {
  features: LandingFeature[]
  mocks: FeatureMocks
}

const MockShell = ({ children }: { children: ReactNode }) => (
  <div className="h-[220px] overflow-hidden border-b border-border bg-muted p-3">
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

      <div className="rounded-md border border-border bg-muted px-2 py-1.5">
        <MockCaption>{labels.statusLabel}</MockCaption>
        <p className="mt-0.5 text-[10px] font-medium text-foreground">{labels.statusValue}</p>
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

const CampaignsMock = ({ labels }: { labels: FeatureMocks["campaigns"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <div className="rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.campaignLabel}</MockCaption>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <Megaphone className="size-3 text-primary" aria-hidden />
          {labels.campaignName}
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.audienceLabel}</MockCaption>
        <p className="mt-1 text-[10px] text-muted-foreground">{labels.audienceTags}</p>
      </div>

      <div className="mt-auto space-y-1">
        <MockCaption>{labels.messageLabel}</MockCaption>
        <p className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1.5 text-[10px] leading-snug text-foreground">
          {labels.messagePreview}
        </p>
        <p className="text-[9px] text-muted-foreground">
          {labels.metricsLabel}: {labels.metricsValue}
        </p>
      </div>
    </div>
  </MockShell>
)

const WhatsAppMock = ({ labels }: { labels: FeatureMocks["whatsapp"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
          <Smartphone className="size-3.5 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <MockCaption>{labels.connectionLabel}</MockCaption>
          <p className="text-[10px] font-medium text-foreground">{labels.phoneNumber}</p>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium text-success">
          <CheckCircle2 className="size-3" aria-hidden />
          {labels.statusConnected}
        </span>
      </div>

      <p className="text-[10px] leading-snug text-muted-foreground">{labels.qrHint}</p>

      <div className="mt-auto rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.inboundLabel}</MockCaption>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <MessageSquare className="size-3 text-primary" aria-hidden />
          {labels.inboundStatus}
        </div>
      </div>
    </div>
  </MockShell>
)

const TemplatesMock = ({ labels }: { labels: FeatureMocks["templates"] }) => (
  <MockShell>
    <div className="flex h-full flex-col gap-2">
      <MockCaption>{labels.quickRepliesLabel}</MockCaption>
      <div className="space-y-1">
        <div className="rounded-md border border-border/60 bg-background px-2 py-1.5 text-[10px] text-muted-foreground">
          {labels.quickReply1}
        </div>
        <div className="rounded-md border border-border/60 bg-background px-2 py-1.5 text-[10px] text-muted-foreground">
          {labels.quickReply2}
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-border/60 bg-background p-2">
        <MockCaption>{labels.templateLabel}</MockCaption>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <Zap className="size-3 shrink-0 text-primary" aria-hidden />
          {labels.templateName}
        </div>
        <p className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {labels.previewLabel}
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-foreground">{labels.composed}</p>
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
    case "campaigns":
      return <CampaignsMock labels={mocks.campaigns} />
    case "whatsapp":
      return <WhatsAppMock labels={mocks.whatsapp} />
    case "templates":
      return <TemplatesMock labels={mocks.templates} />
  }
}

export const LandingFeaturesSection = ({ features, mocks }: LandingFeaturesSectionProps) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {features.map((feature) => (
      <Card
        key={feature.key}
        className="overflow-hidden rounded-xl border border-border bg-card py-0 shadow-none"
      >
        <FeatureMock featureKey={feature.key} mocks={mocks} />
        <CardHeader className="gap-2 px-6 pb-6">
          <CardTitle className="text-lg">{feature.title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
        </CardHeader>
      </Card>
    ))}
  </div>
)
