"use client"

import { useState, Suspense } from "react"
import { IconCirclePlusFilled, IconUsers, IconChevronDown, IconPlus, IconStar, type TablerIcon } from "@tabler/icons-react"
import { usePathname, Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useUser } from "@/components/user-provider"
import { updateDefaultTeamAction } from "@/components/server-actions/user"
import { FeedbackSurveyModal } from "@/components/feedback-survey-modal"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { UserTeam } from "@/components/user-provider"

// Loading component for team selection
function TeamSelectionLoading() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="w-full justify-between cursor-pointer animate-pulse border h-[38px]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <IconUsers className="h-4 w-4 shrink-0" />
            <span className="truncate text-sm bg-muted rounded h-4 w-24"></span>
          </div>
          <IconChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// Team selection component
function TeamSelection() {
  const t = useTranslations("NavMain")
  const { user, loading, refreshUser } = useUser()
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null)
  const [open, setOpen] = useState(false)

  // Get teams from user context
  const teams = user?.teams || []

  // Set default team as selected when teams are available
  if (teams.length > 0 && !selectedTeam) {
    const defaultTeam = user?.defaultTeamId
      ? teams.find(team => team.id === user.defaultTeamId)
      : teams[0]
    setSelectedTeam(defaultTeam || teams[0])
  }

  // Handle team selection change
  const handleTeamSelect = async (team: UserTeam) => {
    setSelectedTeam(team)
    setOpen(false)

    // Update default team in database
    try {
      const result = await updateDefaultTeamAction(team.id)
      if (result.success) {

        // Refresh user data to get updated defaultTeamId
        await refreshUser(false)
        toast.success(t("messages.teamsUpdated"))
      } else {
        console.error("Failed to update default team:", result.error)
        toast.error(t("messages.failedToUpdateDefaultTeam"))
      }
    } catch (error) {
      console.error("Error updating default team:", error)
    }
  }

  // If no teams found, show "Add Team" option
  if (teams.length === 0 && !loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="w-full cursor-pointer border h-[38px]"
          >
            <Link href="/team">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <IconPlus className="h-4 w-4 shrink-0" />
                <span className="truncate text-sm">
                  {t("addTeam")}
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Show team selection combobox
  if (loading) {
    return <TeamSelectionLoading />
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              asChild
              className="w-full justify-between cursor-pointer border h-[38px]"
            >
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto p-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <IconUsers className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">
                    {selectedTeam ? selectedTeam.name : t("selectTeam")}
                  </span>
                </div>
                <IconChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder={t("searchTeams")} />
              <CommandList>
                <CommandEmpty>{t("noTeamsFound")}</CommandEmpty>
                <CommandGroup>
                  {teams.map((team) => (
                    <CommandItem
                      key={team.id}
                      value={team.name}
                      onSelect={() => handleTeamSelect(team)}
                    >
                      <IconUsers className="mr-2 h-4 w-4 text-foreground" />
                      <span className="truncate">{team.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: TablerIcon
  }[]
}) {
  const pathname = usePathname()
  const t = useTranslations("NavMain")
  const { hasPermission } = useUser()
  const userHasPermission = hasPermission()
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  // TODO: Configure these values with your actual survey ID and token
  const FEEDBACK_SURVEY_ID = "cmgplpcbi00033ue9vg6478ic"
  const FEEDBACK_SURVEY_TOKEN = "$2b$10$7JyGsAfU/V5Z5vpbB/5oo.hubThQW59ny6wNdw1VBWTIsWZ7lD78G"

  const canCreateSurvey = userHasPermission.canPost || userHasPermission.isAdmin

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Team Selection with Suspense */}
        <Suspense fallback={<TeamSelectionLoading />}>
          <TeamSelection />
        </Suspense>

        {canCreateSurvey && (
          <SidebarMenu className="mt-2">
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip={t("quickCreate")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
              >
                <IconCirclePlusFilled />
                <Link href="/survey/create" className="w-full">{t("quickCreate")}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => {
            // Check if this item is selected based on the current pathname
            const isSelected =
              (item.url === "/" && (pathname === "/" || pathname.endsWith("/"))) ||
              (item.url !== "/" && pathname.includes(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`cursor-pointer ${isSelected
                    ? "bg-sidebar-accent border border-sidebar-accent-foreground text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* Feedback Survey Item */}
        <SidebarMenu className="mt-auto">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setFeedbackModalOpen(true)}
              className="cursor-pointer [&:hover_.star-bounce]:animate-bounce [&:hover_.star-text-yellow]:text-yellow-400 [&:hover_.star-fill-yellow]:fill-yellow-400"
            >
              <IconStar className="h-5 w-5 star-bounce star-text-yellow star-fill-yellow" />
              <span>Rate our Service</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <FeedbackSurveyModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        surveyId={FEEDBACK_SURVEY_ID}
        token={FEEDBACK_SURVEY_TOKEN}
      />
    </SidebarGroup>
  )
}
