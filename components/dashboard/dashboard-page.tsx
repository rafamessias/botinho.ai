"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Link } from "@/i18n/navigation"

const chartData = [
    { date: "Mon", messages: 45 },
    { date: "Tue", messages: 52 },
    { date: "Wed", messages: 61 },
    { date: "Thu", messages: 58 },
    { date: "Fri", messages: 73 },
    { date: "Sat", messages: 89 },
    { date: "Sun", messages: 67 },
]

const recentActivity = [
    {
        id: 1,
        customer: "Maria Silva",
        message: "Qual o horário de funcionamento?",
        time: "2 min ago",
        status: "answered",
    },
    { id: 2, customer: "João Santos", message: "Vocês fazem entrega?", time: "5 min ago", status: "answered" },
    { id: 3, customer: "Ana Costa", message: "Qual o preço do produto X?", time: "12 min ago", status: "answered" },
    { id: 4, customer: "Pedro Lima", message: "Como faço para cancelar?", time: "18 min ago", status: "pending" },
]

export default function DashboardPage() {
    return (
        <div className="section-spacing">
            {/* Header */}
            <div className="text-center md:text-left">
                <h1 className="heading-primary text-3xl md:text-4xl mb-3">
                    Dashboard
                </h1>
                <p className="body-secondary text-base md:text-lg max-w-2xl">
                    Welcome back! Here's what's happening with your WhatsApp bot today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">Messages Handled</CardTitle>
                        <div className="bg-primary/10 p-2.5 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">445</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">12%</span>
                            <span className="text-muted-foreground">vs last week</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">Avg Response Time</CardTitle>
                        <div className="accent-blue p-2.5 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">1.2s</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowDownRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">8%</span>
                            <span className="text-muted-foreground">faster</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">Satisfaction Rate</CardTitle>
                        <div className="accent-purple p-2.5 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">94%</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">3%</span>
                            <span className="text-muted-foreground">improvement</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">Active Customers</CardTitle>
                        <div className="accent-orange p-2.5 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">1,234</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">18%</span>
                            <span className="text-muted-foreground">growth</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 elegant-card">
                    <CardHeader>
                        <CardTitle className="heading-secondary text-xl">Message Volume</CardTitle>
                        <CardDescription className="body-secondary">Daily messages handled this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                messages: {
                                    label: "Messages",
                                    color: "hsl(var(--primary))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="messages"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ fill: "hsl(var(--primary))", r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="elegant-card">
                    <CardHeader>
                        <CardTitle className="heading-secondary text-xl">Recent Activity</CardTitle>
                        <CardDescription className="body-secondary">Latest customer interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="content-spacing">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="refined-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="heading-secondary text-sm truncate">{activity.customer}</p>
                                        <p className="body-secondary text-xs truncate mt-1">{activity.message}</p>
                                        <p className="caption-text mt-2">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="elegant-gradient border-primary/20 elegant-card">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3 justify-center md:justify-start">
                                <Zap className="w-6 h-6 text-primary" />
                                Ready to train your AI?
                            </h3>
                            <p className="text-muted-foreground">Add knowledge to make your WhatsApp bot even smarter</p>
                        </div>
                        <Button asChild className="professional-button bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3">
                            <Link href="/ai-training" className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Start Training
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}