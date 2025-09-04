"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Crown, Star, Users } from "lucide-react";

interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    icon: React.ReactNode;
}

export const SubscriptionPage = () => {
    const t = useTranslations("Subscription");
    const [isYearly, setIsYearly] = useState(false);

    // Mock current subscription data - in real app, this would come from your backend
    const currentSubscription = {
        plan: "professional",
        status: "active",
        billingCycle: "monthly",
        nextBilling: "2024-02-15"
    };

    const starterFeatures = t.raw("plans.starter.features") as string[];
    const professionalFeatures = t.raw("plans.professional.features") as string[];
    const enterpriseFeatures = t.raw("plans.enterprise.features") as string[];

    const plans: SubscriptionPlan[] = [
        {
            id: "starter",
            name: t("plans.starter.name"),
            description: t("plans.starter.description"),
            features: starterFeatures,
            cta: t("plans.starter.cta"),
            popular: false,
            icon: <Users className="h-6 w-6" />
        },
        {
            id: "professional",
            name: t("plans.professional.name"),
            description: t("plans.professional.description"),
            features: professionalFeatures,
            cta: t("plans.professional.cta"),
            popular: true,
            icon: <Star className="h-6 w-6" />
        },
        {
            id: "enterprise",
            name: t("plans.enterprise.name"),
            description: t("plans.enterprise.description"),
            features: enterpriseFeatures,
            cta: t("plans.enterprise.cta"),
            popular: false,
            icon: <Crown className="h-6 w-6" />
        }
    ];

    const getPrice = (planId: string) => {
        const pricingKey = isYearly ? "yearly" : "monthly";
        return t(`pricing.${pricingKey}.${planId}`);
    };

    const getBillingPeriod = () => {
        return isYearly ? t("pricing.perYear") : t("pricing.perMonth");
    };

    const handleSubscribe = (planId: string) => {
        // In a real app, this would handle subscription logic
        console.log(`Subscribing to ${planId} plan (${isYearly ? 'yearly' : 'monthly'})`);
    };

    const handleManageSubscription = () => {
        // In a real app, this would redirect to subscription management
        console.log("Managing subscription");
    };

    return (
        <div className="space-y-8">
            {/* Current Plan Section */}
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {t("currentPlan.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("currentPlan.description")}
                            </CardDescription>
                        </div>
                        <Button onClick={handleManageSubscription} variant="outline">
                            {t("currentPlan.manageSubscription")}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("currentPlan.status.active")}
                            </p>
                            <p className="text-lg font-semibold capitalize">
                                {plans.find(p => p.id === currentSubscription.plan)?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("currentPlan.billingCycle")}
                            </p>
                            <p className="text-lg font-semibold capitalize">
                                {currentSubscription.billingCycle}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("currentPlan.nextBilling")}
                            </p>
                            <p className="text-lg font-semibold">
                                {new Date(currentSubscription.nextBilling).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
                <Label htmlFor="billing-toggle" className="text-sm font-medium">
                    {t("billingToggle.monthly")}
                </Label>
                <Switch
                    id="billing-toggle"
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                />
                <Label htmlFor="billing-toggle" className="text-sm font-medium">
                    {t("billingToggle.yearly")}
                </Label>
                {isYearly && (
                    <Badge variant="secondary" className="ml-2">
                        {t("billingToggle.save")}
                    </Badge>
                )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative transition-all duration-200 hover:shadow-lg ${plan.popular
                            ? "border-2 border-primary shadow-lg scale-105"
                            : "border hover:border-primary/50"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-primary text-primary-foreground">
                                    {t("billingToggle.save")}
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                                <div className={`p-3 rounded-full ${plan.popular
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                    }`}>
                                    {plan.icon}
                                </div>
                            </div>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription className="text-sm">
                                {plan.description}
                            </CardDescription>
                            <div className="mt-4">
                                <div className="text-3xl font-bold">
                                    {getPrice(plan.id)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {getBillingPeriod()}
                                    {isYearly && plan.id !== "enterprise" && (
                                        <span className="block text-xs">
                                            {t("pricing.billedAnnually")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={plan.popular ? "default" : "outline"}
                                onClick={() => handleSubscribe(plan.id)}
                            >
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-muted-foreground">
                <p>
                    {t("messages.contactSales")}
                </p>
            </div>
        </div>
    );
};
