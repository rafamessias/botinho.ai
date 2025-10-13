"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/components/server-actions/subscription";
import { PlanType } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";

interface Plan {
    id: string;
    planType: PlanType;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    maxActiveSurveys: number;
    maxResponses: number;
    removeBranding: boolean;
    allowApiAccess: boolean;
    allowExport: boolean;
    allowPublicPages: boolean;
}

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plans: Plan[];
    showUpgradeButton: boolean;
}

export const UpgradeModalPlans = ({ open, onOpenChange, plans, showUpgradeButton = true }: UpgradeModalProps) => {
    const t = useTranslations("Subscription.upgradeModal");
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
    const { toast } = useToast();
    const router = useRouter();

    const handleUpgrade = async (planType: PlanType) => {
        setIsLoading(planType);
        try {
            const result = await createCheckoutSession(planType, billingCycle);
            if (result.success && result.checkoutUrl) {
                router.push(result.checkoutUrl);
            } else {
                toast({
                    title: t("error.title"),
                    description: result.error || t("error.description"),
                    variant: "destructive",
                });
            }
            setIsLoading(null);

        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast({
                title: t("error.title"),
                description: t("error.description"),
                variant: "destructive",
            });
            setIsLoading(null);
        }
    };

    const getPlanFeatures = (plan: Plan): string[] => {
        const features = [];

        if (plan.maxActiveSurveys === -1) {
            features.push(t("features.unlimitedSurveys"));
        } else {
            features.push(t("features.activeSurveys", { count: plan.maxActiveSurveys }));
        }

        if (plan.maxResponses === -1) {
            features.push(t("features.unlimitedResponses"));
        } else {
            features.push(t("features.responses", { count: plan.maxResponses }));
        }

        features.push(t("features.analytics"));

        if (plan.removeBranding) {
            features.push(t("features.removeBranding"));
        }

        if (plan.allowExport) {
            features.push(t("features.dataExport"));
        }

        if (plan.allowApiAccess) {
            features.push(t("features.apiAccess"));
        }

        if (plan.allowPublicPages) {
            features.push(t("features.publicPages"));
        }

        if (plan.planType === PlanType.PRO || plan.planType === PlanType.BUSINESS || plan.planType === PlanType.ENTERPRISE) {
            features.push(t("features.prioritySupport"));
        }

        return features;
    };

    const getPlanName = (planType: PlanType): string => {
        return planType.toLowerCase();
    };

    const isPopular = (planType: PlanType): boolean => {
        return planType === PlanType.PRO;
    };

    const formatPrice = (price: number, currency: string): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    //Function to separate decimal from the price to format differently on the screen
    const formatPriceDecimal = (price: number, decimal: true | false): string => {
        const priceParts = (price / 12).toFixed(2).toString().split('.');
        const integerPart = priceParts[0];
        const decimalPart = priceParts[1];
        if (decimal) {
            return decimalPart;
        } else {
            return integerPart;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0">
                <div className="flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                    <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
                        <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                            {t("title")}
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            {t("description")}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Billing Toggle */}
                    <div className=" relative flex justify-center mb-3 sm:mb-4 px-4">
                        <div className="inline-flex items-center gap-1 sm:gap-2 p-1 bg-muted rounded-lg">
                            <Button
                                variant={billingCycle === "monthly" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setBillingCycle("monthly")}
                                className="text-xs sm:text-sm"
                            >
                                {t("billing.monthly")}
                            </Button>
                            <Button
                                variant={billingCycle === "yearly" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setBillingCycle("yearly")}
                                className="relative text-xs sm:text-sm"
                            >
                                {t("billing.yearly")}
                            </Button>
                        </div>
                        <Badge className={`absolute ml-[240px] top-1/2 -translate-y-1/2 text-[10px] sm:text-xs px-1 py-0 ${billingCycle === "yearly" ? 'bg-green-500' : 'bg-muted'}`}>
                            {t("billing.save")}
                        </Badge>
                    </div>

                    {/* Plans Grid - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-2">
                            {plans.map((plan) => {
                                const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
                                const popular = isPopular(plan.planType);

                                return (
                                    <Card
                                        key={plan.id}
                                        className={`relative flex flex-col overflow-visible gap-1 ${popular ? "border-primary shadow-lg" : ""}`}
                                    >
                                        {popular && (
                                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 text-xs bg-primary text-primary-foreground">
                                                {t("popular")}
                                            </Badge>
                                        )}
                                        <CardHeader className="">
                                            <CardTitle className="text-base sm:text-lg capitalize">
                                                {getPlanName(plan.planType)}
                                            </CardTitle>
                                            <CardDescription className="min-h-[32px] sm:min-h-[40px] text-xs sm:text-sm">
                                                {t(`plans.${getPlanName(plan.planType)}.description`)}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 space-y-3 sm:space-y-4">
                                            <div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl sm:text-3xl font-bold ">
                                                        {billingCycle === "yearly" ? (<><span className="text-4xl mt-1">${formatPriceDecimal(price, false)}</span> <span className="text-xs text-muted-foreground -ml-2">.{formatPriceDecimal(price, true)}</span></>) : <span className="text-4xl mt-1">{formatPrice(price, plan.currency)}</span>}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs sm:text-sm">
                                                        {t("pricing.perMonth")}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline h-6">
                                                    <p className="text-xs text-muted-foreground">
                                                        {billingCycle === "yearly" && (
                                                            t("pricing.billedAnnually")
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 sm:space-y-2">
                                                {getPlanFeatures(plan).map((feature, index) => (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-6">
                                            {showUpgradeButton && (
                                                <Button
                                                    onClick={() => handleUpgrade(plan.planType)}
                                                    disabled={isLoading !== null}
                                                    className="w-full text-sm"
                                                    variant={popular ? "default" : "outline"}
                                                >
                                                    {isLoading === plan.planType ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            {t("loading")}
                                                        </>
                                                    ) : (
                                                        t("cta")
                                                    )}
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Footer Note */}
                        <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4 pb-2">
                            {t("footer")}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

