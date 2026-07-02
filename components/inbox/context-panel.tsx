"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  Bot,
  Building2,
  ClipboardList,
  Contact,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  UserCheck,
  UserMinus,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { maskPhoneForDisplay } from "@/lib/phone-utils"
import { ReplyPreviewHoverCard } from "@/components/inbox/reply-preview-hover-card"
import type { QuickAnswerView, TemplateView } from "@/components/ai-training/types"
import type { AssignedAgentView, InboxConversationSummary } from "@/components/inbox/inbox-mappers"
import type { SurveyView } from "@/components/server-actions/surveys"

type SuggestedResponse = {
  id: string
  text: string
  category: string
}

export type ContextPanelProps = {
  conversation: InboxConversationSummary | null
  quickAnswers: QuickAnswerView[]
  templates: TemplateView[]
  surveys: SurveyView[]
  suggestedResponses: SuggestedResponse[]
  assignedTo: AssignedAgentView
  activeSurveyResponseId?: string | null
  currentUserId: string
  visibleQuickAnswers: QuickAnswerView[]
  visibleTemplates: TemplateView[]
  onUseReply: (text: string) => void
  onAssignToMe: () => void
  onRelease: () => void
  onSendSurvey: (surveyId: string, deliveryMode?: "inline" | "hosted") => void
  onShowQuickRepliesModal: () => void
  onShowTemplatesModal: () => void
  isSendingSurvey?: boolean
}

export const ContextPanelSkeleton = () => (
  <div className="h-full overflow-y-auto p-4 space-y-3 pb-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={`context-skeleton-${index}`} className="rounded-xl border border-border/60 p-4 space-y-3">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      </div>
    ))}
  </div>
)

export const ContextPanel = ({
  conversation,
  quickAnswers,
  templates,
  surveys,
  suggestedResponses,
  assignedTo,
  activeSurveyResponseId,
  currentUserId,
  visibleQuickAnswers,
  visibleTemplates,
  onUseReply,
  onAssignToMe,
  onRelease,
  onSendSurvey,
  onShowQuickRepliesModal,
  onShowTemplatesModal,
  isSendingSurvey,
}: ContextPanelProps) => {
  const t = useTranslations("Inbox")

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Contact className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{t("context.empty.title")}</h3>
          <p className="text-xs text-muted-foreground">{t("context.empty.description")}</p>
        </div>
      </div>
    )
  }

  const isAssignedToMe = assignedTo?.id === currentUserId
  const isAssignedToOther = assignedTo != null && !isAssignedToMe
  const showAiSuggestions = !isAssignedToOther

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-3 pb-6">
        <Card className="shadow-none gap-3 py-3">
          <CardHeader className="px-4 pb-0">
            <CardTitle className="text-sm font-medium">{t("context.assignment.title")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 space-y-2">
            {assignedTo ? (
              <div className="flex items-center gap-2 text-xs">
                <UserCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-foreground">
                  {isAssignedToMe
                    ? t("context.assignment.assignedToYou")
                    : t("context.assignment.assignedTo", { name: assignedTo.name })}
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{t("context.assignment.unassigned")}</p>
            )}
            <div className="flex gap-2">
              {!isAssignedToMe && (
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={onAssignToMe}>
                  <UserCheck className="mr-1 h-3 w-3" />
                  {t("context.assignment.takeOver")}
                </Button>
              )}
              {isAssignedToMe && (
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={onRelease}>
                  <UserMinus className="mr-1 h-3 w-3" />
                  {t("context.assignment.release")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none gap-3 py-3">
          <CardHeader className="px-4 pb-0">
            <CardTitle className="text-sm font-medium">{t("context.customer.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate font-medium text-foreground">{conversation.customerName}</span>
            </div>
            {conversation.customerCompany && (
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{conversation.customerCompany}</span>
              </div>
            )}
            {conversation.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{maskPhoneForDisplay(conversation.customerPhone)}</span>
              </div>
            )}
            {conversation.customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{conversation.customerEmail}</span>
              </div>
            )}
            {conversation.customerAddress && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{conversation.customerAddress}</span>
              </div>
            )}
            {conversation.satisfactionScore != null && (
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {t("context.customer.satisfaction", { score: conversation.satisfactionScore })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none gap-2 py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-1">
            <CardTitle className="text-sm font-medium">{t("context.quickReplies.title")}</CardTitle>
            <Link href="/quick-answers" className="text-[11px] font-medium text-primary hover:underline">
              {t("context.quickReplies.manage")}
            </Link>
          </CardHeader>
          <CardContent className="space-y-1 px-4">
            {quickAnswers.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-3 py-4 text-center">
                <Zap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-foreground">{t("context.quickReplies.empty.title")}</p>
                <Button variant="outline" size="sm" className="mt-1 h-7 text-xs" asChild>
                  <Link href="/quick-answers">{t("context.quickReplies.empty.action")}</Link>
                </Button>
              </div>
            ) : (
              <>
                {visibleQuickAnswers.map((quickAnswer) => (
                  <ReplyPreviewHoverCard
                    key={quickAnswer.id}
                    preview={<p className="whitespace-pre-wrap text-foreground">{quickAnswer.content}</p>}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-[11px] leading-snug h-auto py-1.5 px-2 font-normal"
                      onClick={() => onUseReply(quickAnswer.content)}
                    >
                      <span className="line-clamp-2">{quickAnswer.content}</span>
                    </Button>
                  </ReplyPreviewHoverCard>
                ))}
                {quickAnswers.length > visibleQuickAnswers.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-0.5 h-7 w-full text-[11px] font-medium text-primary"
                    onClick={onShowQuickRepliesModal}
                  >
                    {t("context.seeAll", { count: quickAnswers.length })}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none gap-2 py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-1">
            <CardTitle className="text-sm font-medium">{t("context.templates.title")}</CardTitle>
            <Link href="/templates" className="text-[11px] font-medium text-primary hover:underline">
              {t("context.templates.manage")}
            </Link>
          </CardHeader>
          <CardContent className="space-y-1 px-4">
            {templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-3 py-4 text-center">
                <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-foreground">{t("context.templates.empty.title")}</p>
                <Button variant="outline" size="sm" className="mt-1 h-7 text-xs" asChild>
                  <Link href="/templates">{t("context.templates.empty.action")}</Link>
                </Button>
              </div>
            ) : (
              <>
                {visibleTemplates.map((template) => (
                  <div key={template.id} className="space-y-1">
                    <ReplyPreviewHoverCard
                      preview={
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium">{template.name}</p>
                          <p className="whitespace-pre-wrap text-muted-foreground">{template.content}</p>
                        </div>
                      }
                    >
                      <Button
                        variant="ghost"
                        className="w-full h-auto flex-col items-start gap-0.5 py-1.5 px-2 text-left"
                        onClick={() => onUseReply(template.content)}
                      >
                        <span className="text-xs font-medium">{template.name}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1 w-full font-normal">
                          {template.content}
                        </span>
                      </Button>
                    </ReplyPreviewHoverCard>
                  </div>
                ))}
                {templates.length > visibleTemplates.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-0.5 h-7 w-full text-[11px] font-medium text-primary"
                    onClick={onShowTemplatesModal}
                  >
                    {t("context.seeAll", { count: templates.length })}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none gap-2 py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-1">
            <CardTitle className="text-sm font-medium">{t("context.surveys.title")}</CardTitle>
            <Link href="/surveys" className="text-[11px] font-medium text-primary hover:underline">
              {t("context.surveys.manage")}
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            {activeSurveyResponseId && (
              <p className="text-[11px] text-primary font-medium">{t("context.surveys.inProgress")}</p>
            )}
            {surveys.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">{t("context.surveys.empty")}</p>
            ) : (
              surveys.map((survey) => (
                <div key={survey.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{survey.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t(`context.surveys.mode.${survey.deliveryMode}`)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] shrink-0"
                    disabled={isSendingSurvey || Boolean(activeSurveyResponseId)}
                    onClick={() =>
                      onSendSurvey(
                        survey.id,
                        survey.deliveryMode === "inline" ? "inline" : "hosted",
                      )
                    }
                  >
                    <ClipboardList className="mr-1 h-3 w-3" />
                    {t("context.surveys.send")}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {showAiSuggestions && (
          <Card className={`shadow-none ${isAssignedToMe ? "opacity-90" : ""}`}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {isAssignedToMe ? (
                  <>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    {t("context.aiSuggestions.assistiveTitle")}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    {t("context.aiSuggestions.title")}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedResponses.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {t("context.aiSuggestions.empty.description")}
                </p>
              ) : (
                suggestedResponses.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    className="w-full justify-start items-start text-left text-xs h-auto py-2 px-3 whitespace-normal break-words"
                    onClick={() => onUseReply(suggestion.text)}
                  >
                    {suggestion.text}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
