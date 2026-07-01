"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteScheduleServiceAction } from "@/components/server-actions/schedule"
import type { AgendaProfile, ScheduleService } from "@/lib/types/schedule"

type ScheduleServicesTableProps = {
  services: ScheduleService[]
  profiles: AgendaProfile[]
  defaultBufferMinutes: number
  onAdd: () => void
  onEdit: (service: ScheduleService) => void
  onChanged: () => void
}

export const ScheduleServicesTable = ({
  services,
  profiles,
  defaultBufferMinutes,
  onAdd,
  onEdit,
  onChanged,
}: ScheduleServicesTableProps) => {
  const t = useTranslations("Schedule")
  const [serviceToDelete, setServiceToDelete] = useState<ScheduleService | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const profileNameById = useMemo(
    () =>
      new Map(
        profiles.map((profile) => [profile.memberUid, profile.displayName ?? profile.memberUid]),
      ),
    [profiles],
  )

  const handleDelete = async () => {
    if (!serviceToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteScheduleServiceAction({ serviceId: serviceToDelete.id })
      if (!result.success) {
        throw new Error(result.error || t("messages.saveFailed"))
      }
      toast.success(t("messages.serviceDeleted"))
      setServiceToDelete(null)
      onChanged()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("messages.saveFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{t("services.title")}</CardTitle>
            <CardDescription>{t("services.description")}</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.addService")}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">{t("services.empty")}</p>
              <Button variant="outline" onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.addService")}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("services.table.name")}</TableHead>
                  <TableHead>{t("services.table.duration")}</TableHead>
                  <TableHead>{t("services.table.buffer")}</TableHead>
                  <TableHead>{t("services.table.assignees")}</TableHead>
                  <TableHead>{t("services.table.status")}</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => {
                  const assigneeLabels = service.assigneeIds
                    .map((id) => profileNameById.get(id))
                    .filter(Boolean)

                  return (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="font-medium">{service.name}</div>
                        {service.description ? (
                          <div className="max-w-xs truncate text-xs text-muted-foreground">
                            {service.description}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>{t("services.minutesValue", { value: service.durationMinutes })}</TableCell>
                      <TableCell>
                        {t("services.bufferSummary", {
                          before: service.bufferBeforeMinutes ?? 0,
                          after: service.bufferAfterMinutes ?? defaultBufferMinutes,
                        })}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {assigneeLabels.length > 0
                            ? assigneeLabels.join(", ")
                            : t("services.noAssignees")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? t("services.active") : t("services.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t("services.table.actions")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(service)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {t("actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setServiceToDelete(service)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("actions.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(serviceToDelete)} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("services.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("services.deleteDescription", { name: serviceToDelete?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("actions.close")}</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {t("actions.delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
