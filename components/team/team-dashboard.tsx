"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IconPlus, IconEdit, IconUsers, IconChevronDown } from "@tabler/icons-react"
import { toast } from "sonner"
import { TeamForm } from "@/components/team/team-form"
import { InviteMemberForm } from "@/components/team/invite-member-form"
import { TeamMembers } from "@/components/team/team-members"
import { useUser } from "@/components/user-provider"
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
import { cn } from "@/lib/utils"

interface Team {
    id: number
    name: string
    description?: string | null
    members: Array<{
        id: number
        isAdmin: boolean
        canPost: boolean
        canApprove: boolean
        isOwner: boolean
        teamMemberStatus: string
        user: {
            id: number
            firstName: string
            lastName: string
            email: string
            avatarUrl?: string | null
        }
    }>
}

interface TeamDashboardProps {
    initialTeams: Team[]
    currentUserId: number
}

export const TeamDashboard = ({ initialTeams, currentUserId }: TeamDashboardProps) => {
    const t = useTranslations("Team")
    const { user, refreshUser } = useUser()
    const [teams, setTeams] = useState<Team[]>(initialTeams)
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(initialTeams.length > 0 ? initialTeams[0] : null)


    // Use current user ID from user context if available, fallback to prop
    const currentUserIdFromContext = user?.id || currentUserId
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showInviteForm, setShowInviteForm] = useState(false)
    const [open, setOpen] = useState(false)

    // Update teams from user context when user data changes
    useEffect(() => {
        if (user?.teams) {
            setTeams(user.teams as Team[])
            // Update selected team if it still exists in the new data
            if (selectedTeam) {
                const updatedTeam = user.teams.find(t => t.id === selectedTeam.id)
                if (updatedTeam) {
                    setSelectedTeam(updatedTeam as Team)
                } else if (user.teams.length > 0) {
                    // If selected team no longer exists, select the first available team
                    setSelectedTeam(user.teams[0] as Team)
                }
            } else if (user.teams.length > 0) {
                // If no team is selected, select the first one
                setSelectedTeam(user.teams[0] as Team)
            }
        }
    }, [user?.teams, selectedTeam])

    const handleTeamUpdate = async () => {
        try {
            // Refresh user data which includes teams
            await refreshUser(false)
            toast.success(t("messages.teamsUpdated"))
        } catch (error) {
            console.error("Failed to refresh teams:", error)
            toast.error(t("messages.failedToRefreshTeams"))
        }
    }

    const isCurrentUserAdmin = (team: Team) => {
        const isAdmin = team.members.some(m =>
            m.user.id === currentUserIdFromContext && m.isAdmin
        )
        return isAdmin
    }

    if (teams.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <IconUsers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">{t("noTeams")}</h1>
                <p className="text-muted-foreground mb-6">{t("noTeamsDescription")}</p>
                <Button onClick={() => setShowCreateForm(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    {t("createFirstTeam")}
                </Button>

                {showCreateForm && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="max-w-md w-full">
                            <TeamForm
                                onSuccess={() => {
                                    setShowCreateForm(false)
                                    handleTeamUpdate()
                                }}
                                onCancel={() => setShowCreateForm(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="px-4 lg:px-6">
            <div className="mb-6 lg:mb-8">
                <p className="text-muted-foreground text-sm lg:text-base">{t("description")}</p>
            </div>

            {/* Main Team Card */}
            <Card className="border-none">
                <CardHeader className="space-y-4 lg:space-y-6">
                    {/* Team Selection and Actions */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between lg:w-[300px]"
                                    >
                                        {selectedTeam ? selectedTeam.name : "Select a team..."}
                                        <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[calc(100vw-2rem)] p-0 lg:w-[300px]">
                                    <Command>
                                        <CommandInput placeholder="Search teams..." />
                                        <CommandList>
                                            <CommandEmpty>No teams found.</CommandEmpty>
                                            <CommandGroup>
                                                {teams.map((team) => (
                                                    <CommandItem
                                                        key={team.id}
                                                        value={team.name}
                                                        onSelect={() => {
                                                            setSelectedTeam(team)
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <IconUsers className="mr-2 h-4 w-4" />
                                                        <span className="truncate">{team.name}</span>
                                                        <span className="ml-auto text-xs text-muted-foreground shrink-0">
                                                            {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => setShowCreateForm(true)}
                                variant="outline"
                                className="w-full lg:w-auto"
                            >
                                <IconPlus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">{t("createTeam")}</span>
                                <span className="sm:hidden">Create</span>
                            </Button>
                        </div>
                    </div>

                    {/* Team Info Section */}
                    {selectedTeam && (
                        <>
                            <Separator />
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-xl lg:text-2xl">{selectedTeam.name}</CardTitle>
                                    {selectedTeam.description && (
                                        <CardDescription className="mt-2 text-sm">
                                            {selectedTeam.description}
                                        </CardDescription>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                        <span>{selectedTeam.members.length} member{selectedTeam.members.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowEditForm(true)}
                                        className="w-full sm:w-auto"
                                    >
                                        <IconEdit className="h-4 w-4 mr-2" />
                                        <span className="sm:hidden">Edit</span>
                                        <span className="hidden sm:inline">{t("editTeam")}</span>
                                    </Button>
                                </div>
                            </div>

                        </>
                    )}

                    {/* No Team Selected */}
                    {!selectedTeam && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">{t("modals.noTeamSelected")}</p>
                        </div>
                    )}
                </CardHeader>

                {/* Team Members Section */}
                {selectedTeam && (
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{t("members.title")}</h3>
                                    <p className="text-sm text-muted-foreground">{t("members.description")}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowInviteForm(true)}
                                        className="w-full sm:w-auto"
                                    >
                                        <IconPlus className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">{t("members.inviteMember")}</span>
                                        <span className="sm:hidden">Add</span>
                                    </Button>
                                </div>
                            </div>

                            <TeamMembers
                                teamId={selectedTeam.id}
                                members={selectedTeam.members as any}
                                currentUserId={currentUserIdFromContext}
                                isCurrentUserAdmin={isCurrentUserAdmin(selectedTeam)}
                                onMemberUpdate={handleTeamUpdate}
                                onInviteMember={() => setShowInviteForm(true)}
                            />
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Modals */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <TeamForm
                            onSuccess={() => {
                                setShowCreateForm(false)
                                handleTeamUpdate()
                            }}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                </div>
            )}

            {showEditForm && selectedTeam && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <TeamForm
                            team={selectedTeam}
                            onSuccess={() => {
                                setShowEditForm(false)
                                handleTeamUpdate()
                            }}
                            onCancel={() => setShowEditForm(false)}
                        />
                    </div>
                </div>
            )}

            {showInviteForm && selectedTeam && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <InviteMemberForm
                            teamId={selectedTeam.id}
                            onSuccess={() => {
                                setShowInviteForm(false)
                                handleTeamUpdate()
                            }}
                            onCancel={() => setShowInviteForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
