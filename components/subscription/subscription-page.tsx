"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileCheck, BarChart3, Users, MessageSquare, Calendar, AlertTriangle, CheckCircle, Clock, Info, Zap, RefreshCw, Eye } from "lucide-react";
import { createPortalSession, getAvailablePlans } from "@/components/server-actions/subscription";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PlanType } from "@/lib/generated/prisma";
import { UpgradeModalPlans } from "./upgrade-modal-plans";
import { useUser } from "@/components/user-provider";

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
    checkoutCanceled?: boolean;
}

export const SubscriptionPage = ({ subscriptionData, checkoutCanceled = false }: SubscriptionPageProps) => {
    const t = useTranslations("Subscription");
    const [isLoading, setIsLoading] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [availablePlans, setAvailablePlans] = useState<any[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showUpgradeButton, setShowUpgradeButton] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showCheckoutCanceledAlert, setShowCheckoutCanceledAlert] = useState(checkoutCanceled);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { hasPermission } = useUser();
    const userHasPermission = hasPermission();

    // Auto-refresh when returning from successful upgrade/checkout
    useEffect(() => {
        const success = searchParams.get('success');
        const canceled = searchParams.get('canceled');
        const sessionId = searchParams.get('session_id');

        if (success === 'true' || sessionId) {
            // Show success message
            setShowSuccessAlert(true);

            // Automatically refresh the data to get updated subscription
            const refreshData = async () => {
                setIsRefreshing(true);
                try {
                    router.refresh();
                    // Small delay to ensure the refresh completes
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    toast({
                        title: t("toast.upgradeSuccess.title"),
                        description: t("toast.upgradeSuccess.description"),
                        variant: "default",
                    });
                } catch (error) {
                    console.error('Error refreshing after upgrade:', error);
                } finally {
                    setIsRefreshing(false);
                }
            };

            refreshData();

            // Clean up URL parameters after a short delay
            setTimeout(() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('success');
                url.searchParams.delete('session_id');
                window.history.replaceState({}, '', url.toString());
            }, 2000);
        } else if (canceled === 'true') {
            setShowCheckoutCanceledAlert(true);
        }
    }, [searchParams, router, toast, t, checkoutCanceled]);

    const handleManageSubscription = async () => {
        setIsLoading(true);
        if (!userHasPermission.isAdmin) {
            toast({
                title: t("Access denied"),
                description: t("You are not authorized to manage the subscription."),
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
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

    const handleUpgradeClick = async () => {
        if (!userHasPermission.isAdmin) {
            toast({
                title: t("Access denied"),
                description: t("You are not authorized to upgrade the subscription."),
                variant: "destructive",
            });
            return;
        }
        setShowUpgradeButton(true);
        if (availablePlans.length === 0) {
            setLoadingPlans(true);
            try {
                const result = await getAvailablePlans();
                if (result.success && result.plans) {
                    setAvailablePlans(result.plans);
                    setShowUpgradeButton(true);
                    setUpgradeModalOpen(true);
                } else {
                    toast({
                        title: t("toast.error.title"),
                        description: t("toast.error.description"),
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
                toast({
                    title: t("toast.error.title"),
                    description: t("toast.error.description"),
                    variant: "destructive",
                });
            } finally {
                setLoadingPlans(false);
            }
        } else {
            setUpgradeModalOpen(true);
        }
    };

    const handleViewPlans = async () => {
        if (availablePlans.length === 0) {
            setLoadingPlans(true);
            try {
                const result = await getAvailablePlans();
                if (result.success && result.plans) {
                    setAvailablePlans(result.plans);
                    setShowUpgradeButton(false);
                    setUpgradeModalOpen(true);
                } else {
                    toast({
                        title: t("toast.error.title"),
                        description: t("toast.error.description"),
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
                toast({
                    title: t("toast.error.title"),
                    description: t("toast.error.description"),
                    variant: "destructive",
                });
            } finally {
                setLoadingPlans(false);
            }
        } else {
            setUpgradeModalOpen(true);
        }
    };

    // Manual refresh function
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            // Refresh the page data from the server
            router.refresh();
            // Small delay to show the refresh animation
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error refreshing data:', error);
            toast({
                title: t("toast.error.title"),
                description: t("toast.error.description"),
                variant: "destructive",
            });
        } finally {
            setIsRefreshing(false);
        }
    }, [router, toast, t]);

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
    const isFreePlan = subscription?.plan?.planType === PlanType.FREE;

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
            {/* Upgrade Success Alert */}
            {showSuccessAlert && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-900 dark:text-green-100">
                        {t("page.upgradeSuccess.title")}
                    </AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        {t("page.upgradeSuccess.description")}
                    </AlertDescription>
                </Alert>
            )}

            {/* Checkout Canceled Alert */}
            {showCheckoutCanceledAlert && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-900 dark:text-blue-100">
                        {t("page.checkoutCanceled.title")}
                    </AlertTitle>
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                        {t("page.checkoutCanceled.description")}
                    </AlertDescription>
                </Alert>
            )}

            {/* Subscription Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="relative sm:absolute right-0 flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full justify-end mb-2 sm:mb-0">
                            {/* Refresh Button */}
                            <Button
                                onClick={handleRefresh}
                                variant="ghost"
                                size="icon"
                                disabled={isRefreshing}
                                className="h-9 w-9"
                                title="Refresh subscription data"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </Button>

                            {/* View Plans Button */}
                            {!isFreePlan && (
                                <Button
                                    onClick={handleViewPlans}
                                    variant="outline"
                                    disabled={loadingPlans}
                                    className="flex "
                                >
                                    {loadingPlans ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("page.loading")}
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="mr-2 h-4 w-4" />
                                            {t("page.viewPlans")}
                                        </>
                                    )}
                                </Button>
                            )}

                            {isFreePlan && userHasPermission.isAdmin ? (
                                <Button
                                    onClick={handleUpgradeClick}
                                    disabled={loadingPlans}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                >
                                    {loadingPlans ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("page.loading")}
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="mr-2 h-4 w-4" />
                                            {t("upgradeModal.upgradeNow")}
                                        </>
                                    )}
                                </Button>
                            ) : (
                                userHasPermission.isAdmin && (
                                    <Button
                                        onClick={handleManageSubscription}
                                        variant="default"
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
                                ))}
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

            {/* Upgrade Modal */}
            <UpgradeModalPlans
                open={upgradeModalOpen}
                onOpenChange={setUpgradeModalOpen}
                plans={availablePlans}
                showUpgradeButton={showUpgradeButton}
            />
        </div>
    );
};
