"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import {
    Building2,
    User,
    Bell,
    Smartphone,
    CreditCard,
    Shield,
    Save,
    Users,
    Plus,
    Trash2,
    Mail,
    Phone,
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
import { Badge } from "@/components/ui/badge"

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

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [newMessageAlerts, setNewMessageAlerts] = useState(true)
    const [dailyReports, setDailyReports] = useState(false)

    // AI settings
    const [autoReply, setAutoReply] = useState(true)

    const handleSaveProfile = () => {
        // In a real app, this would update the backend
        toast.success("Profile updated!")
    }

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

    const handleSaveNotifications = () => {
        toast.success("Notification preferences saved!")
    }

    return (
        <div className="section-spacing">
            {/* Header */}
            <div>
                <h1 className="heading-primary text-3xl">Settings</h1>
                <p className="body-secondary mt-1">Manage your account and preferences</p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="team" className="gap-2">
                        <Users className="w-4 h-4" />
                        Team
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="gap-2">
                        <Smartphone className="w-4 h-4" />
                        WhatsApp
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Billing
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" />
                                </div>
                            </div>
                            <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Business Information
                            </CardTitle>
                            <CardDescription>Manage your business details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input id="businessName" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessDescription">Business Description</Label>
                                <Textarea
                                    id="businessDescription"
                                    rows={4}
                                />
                            </div>
                            <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

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
                                    className={`p-4 rounded-xl border ${number.connected ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${number.connected ? "status-connected" : "status-disconnected"
                                                    }`}
                                            >
                                                <Smartphone className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{number.name}</p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {number.number}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm font-medium ${number.connected ? "text-primary" : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {number.connected ? "Connected" : "Disconnected"}
                                                    </span>
                                                    {number.connected && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                                                </div>
                                                {number.connected && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {number.messagesThisMonth} messages this month
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveNumber(number.id)}
                                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {!number.connected && (
                                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                                            Connect Number
                                        </Button>
                                    )}
                                </div>
                            ))}

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

                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Current Plan
                            </CardTitle>
                            <CardDescription>Manage your subscription</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground">Starter Plan</h3>
                                        <p className="text-muted-foreground mt-1">500 messages/month</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-foreground">$9</p>
                                        <p className="text-sm text-muted-foreground">per month</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Shield className="w-4 h-4" />
                                    <span>Next billing date: February 15, 2025</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    Change Plan
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 bg-transparent">
                                    Cancel Subscription
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>Manage your payment information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">•••• •••• •••• 4242</p>
                                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Update
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
