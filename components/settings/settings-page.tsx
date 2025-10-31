"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import {
    Bell,
    Smartphone,
    Save,
    Users,
    Plus,
    Trash2,
    Phone,
    Edit,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TeamMember = {
    id: string
    name: string
    email: string
    role: "admin" | "agent" | "viewer"
    status: "active" | "pending"
}

type WhatsAppNumber = {
    id: string
    number: string
    name: string
    connected: boolean
    messagesThisMonth: number
}

export default function SettingsPage() {

    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [newMemberName, setNewMemberName] = useState("")
    const [newMemberEmail, setNewMemberEmail] = useState("")
    const [newMemberRole, setNewMemberRole] = useState<"admin" | "agent" | "viewer">("agent")

    const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumber[]>([
        { id: "1", number: "+55 11 98765-4321", name: "Main Support", connected: true, messagesThisMonth: 342 },
        { id: "2", number: "+55 11 91234-5678", name: "Sales Team", connected: true, messagesThisMonth: 189 },
        { id: "3", number: "+55 11 99876-5432", name: "Customer Service", connected: false, messagesThisMonth: 0 },
    ])

    const [isAddNumberOpen, setIsAddNumberOpen] = useState(false)
    const [newNumberPhone, setNewNumberPhone] = useState("")
    const [newNumberName, setNewNumberName] = useState("")
    const [isEditNumberOpen, setIsEditNumberOpen] = useState(false)
    const [editingNumber, setEditingNumber] = useState<WhatsAppNumber | null>(null)
    const [editNumberPhone, setEditNumberPhone] = useState("")
    const [editNumberName, setEditNumberName] = useState("")

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [newMessageAlerts, setNewMessageAlerts] = useState(true)
    const [dailyReports, setDailyReports] = useState(false)

    // AI settings
    const [autoReply, setAutoReply] = useState(true)

    const handleAddMember = () => {
        if (!newMemberName || !newMemberEmail) {
            toast.error("Missing information", {
                description: "Please fill in all fields.",
            })
            return
        }

        const newMember: TeamMember = {
            id: Date.now().toString(),
            name: newMemberName,
            email: newMemberEmail,
            role: newMemberRole,
            status: "pending",
        }

        setIsAddMemberOpen(false)
        setNewMemberName("")
        setNewMemberEmail("")
        setNewMemberRole("agent")

        toast.success(`An invitation has been sent to ${newMemberEmail}`)
    }

    const handleRemoveMember = (id: string) => {
        toast.success("Member removed")
    }

    const handleAddNumber = () => {
        if (!newNumberPhone || !newNumberName) {
            toast.error("Missing information Please fill in all fields.")
            return
        }

        const newNumber: WhatsAppNumber = {
            id: Date.now().toString(),
            number: newNumberPhone,
            name: newNumberName,
            connected: false,
            messagesThisMonth: 0,
        }

        setWhatsappNumbers([...whatsappNumbers, newNumber])
        setIsAddNumberOpen(false)
        setNewNumberPhone("")
        setNewNumberName("")

        toast.success("WhatsApp number added!")
    }

    const handleRemoveNumber = (id: string) => {
        setWhatsappNumbers(whatsappNumbers.filter((number) => number.id !== id))
        toast.success("Number removed")
    }

    const handleSaveWhatsApp = () => {
        toast.success("WhatsApp settings updated!")
    }

    const resetEditNumberState = () => {
        setIsEditNumberOpen(false)
        setEditingNumber(null)
        setEditNumberPhone("")
        setEditNumberName("")
    }

    const handleOpenEditNumber = (number: WhatsAppNumber) => {
        setEditingNumber(number)
        setEditNumberName(number.name)
        setEditNumberPhone(number.number)
        setIsEditNumberOpen(true)
    }

    const handleUpdateNumber = () => {
        if (!editingNumber) {
            return
        }

        if (!editNumberName || !editNumberPhone) {
            toast.error("Missing information", {
                description: "Please fill in all fields.",
            })
            return
        }

        setWhatsappNumbers((numbers) =>
            numbers.map((item) =>
                item.id === editingNumber.id
                    ? {
                        ...item,
                        name: editNumberName,
                        number: editNumberPhone,
                    }
                    : item,
            ),
        )

        toast.success("WhatsApp number updated!")
        resetEditNumberState()
    }

    const handleSaveNotifications = () => {
        toast.success("Notification preferences saved!")
    }

    return (
        <div className="">

            {/* Settings Tabs */}
            <Tabs defaultValue="whatsapp" className="space-y-6">
                <TabsList className="flex w-full overflow-x-auto sm:w-min">
                    <TabsTrigger value="whatsapp" className="gap-2 flex-shrink-0 px-6">
                        <Smartphone className="w-4 h-4" />
                        WhatsApp
                    </TabsTrigger>
                    {/*}
                    <TabsTrigger value="team" className="gap-2 flex-shrink-0">
                        <Users className="w-4 h-4" />
                        Team
                    </TabsTrigger>
                    */}
                    <TabsTrigger value="notifications" className="gap-2 flex-shrink-0 px-6">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Team Members
                                    </CardTitle>
                                    <CardDescription>Invite and manage your team members</CardDescription>
                                </div>
                                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Invite Team Member</DialogTitle>
                                            <DialogDescription>Send an invitation to join your team</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="memberName">Full Name</Label>
                                                <Input
                                                    id="memberName"
                                                    placeholder="John Doe"
                                                    value={newMemberName}
                                                    onChange={(e) => setNewMemberName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="memberEmail">Email</Label>
                                                <Input
                                                    id="memberEmail"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={newMemberEmail}
                                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="memberRole">Role</Label>
                                                <Select value={newMemberRole} onValueChange={(value: any) => setNewMemberRole(value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin - Full access</SelectItem>
                                                        <SelectItem value="agent">Agent - Can manage conversations</SelectItem>
                                                        <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                                Send Invitation
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                    </Card>
                </TabsContent>

                {/* WhatsApp Tab */}
                <TabsContent value="whatsapp" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Smartphone className="w-5 h-5" />
                                        WhatsApp Numbers
                                    </CardTitle>
                                    <CardDescription>Manage your WhatsApp Business numbers</CardDescription>
                                </div>
                                <Dialog open={isAddNumberOpen} onOpenChange={setIsAddNumberOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Number
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add WhatsApp Number</DialogTitle>
                                            <DialogDescription>Connect a new WhatsApp Business number</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="numberName">Number Name</Label>
                                                <Input
                                                    id="numberName"
                                                    placeholder="e.g., Main Support, Sales Team"
                                                    value={newNumberName}
                                                    onChange={(e) => setNewNumberName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    placeholder="+55 11 98765-4321"
                                                    value={newNumberPhone}
                                                    onChange={(e) => setNewNumberPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddNumberOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleAddNumber} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                                Add Number
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {whatsappNumbers.map((number) => (
                                <div
                                    key={number.id}
                                    className={`space-y-4 rounded-xl border p-4 ${number.connected ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"}`}
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-full ${number.connected ? "status-connected" : "status-disconnected"}`}
                                            >
                                                <Smartphone className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="heading-secondary text-base">{number.name}</p>
                                                <p className="body-secondary flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{number.number}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 md:items-end">
                                            <div className="flex flex-col items-start gap-2 text-sm md:items-end">
                                                <span className={`${number.connected ? "text-primary" : "text-muted-foreground"} font-medium`}>
                                                    {number.connected ? "Connected" : "Disconnected"}
                                                </span>
                                                {number.connected && (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{number.messagesThisMonth} messages this month</span>
                                                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 md:justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenEditNumber(number)}
                                                    className="w-full text-muted-foreground hover:bg-muted/40 hover:text-foreground md:w-auto"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveNumber(number.id)}
                                                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive/80 md:w-auto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {!number.connected && (
                                        <div className="flex w-full items-center justify-center sm:justify-end">
                                            <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                                Connect Number
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Dialog
                                open={isEditNumberOpen}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        resetEditNumberState()
                                    }
                                }}
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit WhatsApp Number</DialogTitle>
                                        <DialogDescription>Update the name and phone number for this WhatsApp connection.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="editNumberName">Number Name</Label>
                                            <Input
                                                id="editNumberName"
                                                placeholder="e.g., Main Support"
                                                value={editNumberName}
                                                onChange={(e) => setEditNumberName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editNumberPhone">Phone Number</Label>
                                            <Input
                                                id="editNumberPhone"
                                                placeholder="+55 11 98765-4321"
                                                value={editNumberPhone}
                                                onChange={(e) => setEditNumberPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                        <Button variant="outline" onClick={resetEditNumberState} className="w-full sm:w-auto">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleUpdateNumber}
                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Auto-Reply</Label>
                                        <p className="text-sm text-muted-foreground">Automatically respond to customer messages</p>
                                    </div>
                                    <Switch checked={autoReply} onCheckedChange={setAutoReply} />
                                </div>
                            </div>

                            <Button onClick={handleSaveWhatsApp} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New Message Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when customers send messages</p>
                                </div>
                                <Switch checked={newMessageAlerts} onCheckedChange={setNewMessageAlerts} />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Daily Reports</Label>
                                    <p className="text-sm text-muted-foreground">Receive daily summary of your bot's activity</p>
                                </div>
                                <Switch checked={dailyReports} onCheckedChange={setDailyReports} />
                            </div>

                            <Button onClick={handleSaveNotifications} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Save className="w-4 h-4 mr-2" />
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
