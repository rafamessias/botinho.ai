"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileCheck, BarChart3, Users, MessageSquare, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { createPortalSession } from "@/components/server-actions/subscription";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PlanType } from "@/lib/generated/prisma";


interface UsageMetric {
    metricType: string;
    limit: number;
    currentUsage: number;
    remaining: number;
    percentageUsed: number;
    isOverLimit: boolean;
    periodStart?: Date;
    periodEnd?: Date;
}

interface SubscriptionPageProps {
    subscriptionData: {
        success: boolean;
        error?: string;
        data?: {
            subscription: any;
            usage: any;
        } | null;
    };
}

export const SubscriptionPage = ({ subscriptionData }: SubscriptionPageProps) => {
    const t = useTranslations("Subscription");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            const result = await createPortalSession();

            if (result && !result.success) {
                // Check if it's a portal configuration error
                const errorMessage = result.error || '';
                if (errorMessage.includes('Customer portal is not configured') || errorMessage.includes('No configuration provided')) {
                    toast({
                        title: t("toast.portalNotConfigured.title"),
                        description: t("toast.portalNotConfigured.description"),
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: t("toast.error.title"),
                        description: t("toast.error.description"),
                        variant: "destructive",
                    });
                }
            }

            if (result && result.success) router.push(result.url || '');

        } catch (error) {
            console.error('Error creating portal session:', error);
            toast({
                title: t("toast.error.title"),
                description: t("toast.error.description"),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getMetricIcon = (metricType: string) => {
        switch (metricType) {
            case 'ACTIVE_SURVEYS':
                return <FileCheck className="h-4 w-4" />;
            case 'TOTAL_COMPLETED_RESPONSES':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    const getMetricLabel = (metricType: string) => {
        switch (metricType) {
            case 'ACTIVE_SURVEYS':
                return t("page.activeSurveys");
            case 'TOTAL_COMPLETED_RESPONSES':
                return t("page.totalResponses");
            default:
                return metricType;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />{t("page.active")}</Badge>;
            case 'trialing':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />{t("page.trial")}</Badge>;
            case 'canceled':
                return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{t("page.canceled")}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Get subscription and usage data
    const subscription = subscriptionData.success ? subscriptionData.data?.subscription : null;
    const usage = subscriptionData.success ? subscriptionData.data?.usage : null;

    if (!subscriptionData.success) {
        return (
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("page.unableToLoadData")}</CardTitle>
                        <CardDescription>
                            {subscriptionData.error || t("page.errorLoadingData")}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("page.noSubscriptionFound")}</CardTitle>
                        <CardDescription>
                            {t("page.noSubscriptionDescription")}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Subscription Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="relative sm:absolute right-0 flex items-center gap-2 w-full justify-end mb-2 sm:mb-0">
                            <Button
                                onClick={handleManageSubscription}
                                variant="outline"
                                disabled={isLoading}

                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("page.loading")}
                                    </>
                                ) : (
                                    t("currentPlan.manageSubscription")
                                )}
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {t("page.title")}
                        </div>

                    </CardTitle>
                    <CardDescription>
                        {t("page.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("page.plan")}</p>
                            <p className="text-lg font-semibold capitalize">
                                {subscription.plan?.planType || t("page.unknown")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("page.status")}</p>
                            <div className="mt-1">
                                {getStatusBadge(subscription.status)}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("page.billingCycle")}</p>
                            <p className="text-lg font-semibold capitalize">
                                {subscription.billingInterval || t("page.monthly")}
                            </p>
                        </div>
                    </div>

                    {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t("page.currentPeriod")}</p>
                                <p className="text-sm">
                                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                                </p>
                            </div>
                            {subscription.cancelAtPeriodEnd && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t("page.cancellation")}</p>
                                    <p className="text-sm text-orange-600">
                                        {t("page.willCancelAtPeriodEnd")}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Usage Metrics */}
            {usage && usage.usage && usage.usage.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            {t("page.usageMetrics")}
                        </CardTitle>
                        <CardDescription>
                            {t("page.currentUsage")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {usage.usage.map((metric: UsageMetric, index: number) => (
                            <div key={index} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getMetricIcon(metric.metricType)}
                                        <span className="font-medium">
                                            {getMetricLabel(metric.metricType)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-medium">
                                            {metric.currentUsage.toLocaleString()} / {metric.limit === -1 ? t("page.unlimited") : metric.limit.toLocaleString()}
                                        </span>
                                        {metric.limit !== -1 && (
                                            <span className="text-xs text-muted-foreground ml-2">
                                                ({metric.percentageUsed.toFixed(1)}%)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {metric.limit !== -1 && (
                                    <div className="space-y-2">
                                        <Progress
                                            value={metric.percentageUsed}
                                            className={`h-2 ${metric.isOverLimit ? '[&>div]:bg-red-500' : ''}`}
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>
                                                {metric.remaining > 0 ? `${metric.remaining.toLocaleString()} ${t("page.remaining")}` : t("page.limitReached")}
                                            </span>
                                            {metric.isOverLimit && (
                                                <span className="text-red-600 font-medium">
                                                    {t("page.overLimit")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Plan Features */}
            {subscription.plan && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t("page.planFeatures")}</CardTitle>
                        <CardDescription>
                            {t("page.featuresIncluded")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">
                                        {t("page.maxActiveSurveys")}: {subscription.plan.maxActiveSurveys === -1 ? t("page.unlimited") : subscription.plan.maxActiveSurveys.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">
                                        {t("page.maxResponses")}: {subscription.plan.maxResponses === -1 ? t("page.unlimited") : subscription.plan.maxResponses.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">
                                        {t("page.analytics")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {subscription.plan.removeBranding ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-sm">
                                        {t("page.removeBranding")}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {subscription.plan.allowExport ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-sm">
                                        {t("page.exports")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {subscription.plan.allowApiAccess ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-sm">
                                        {t("page.apis")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {subscription.plan.allowPublicPages ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-sm">
                                        {t("page.publicPageSurvey")}
                                        <span className="text-xs text-muted-foreground ml-1">{t("page.comingSoon")}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {subscription.plan.planType === PlanType.BUSINESS || subscription.plan.planType === PlanType.ENTERPRISE || subscription.plan.planType === PlanType.PRO ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-sm">
                                        {t("page.prioritySupport")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
