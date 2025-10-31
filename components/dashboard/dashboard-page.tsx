"use client"

import { ArrowDownRight, ArrowUpRight, Clock, MessageSquare, TrendingUp, Users, Zap } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export const description = "A simple area chart"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig


export default function DashboardPage() {
    return (
        <div className="section-spacing">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
            <div className="mb-6 w-full">
                {/* Chart */}
                <Card className="elegant-card w-full">
                    <CardHeader>
                        <CardTitle>Area Chart</CardTitle>
                        <CardDescription>
                            Showing total visitors for the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[320px] w-full aspect-auto">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area
                                    dataKey="desktop"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                    January - June 2024
                                </div>
                            </div>
                        </div>
                    </CardFooter>
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
