"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createPortalSession } from "@/components/server-actions/subscription";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";


export const SubscriptionPage = () => {
    const t = useTranslations("Subscription");
    const [isLoading, setIsLoading] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState({
        plan: "professional",
        status: "active",
        billingCycle: "monthly",
        nextBilling: "2024-02-15"
    });
    const { toast } = useToast();

    // Check for success/cancel parameters in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const canceled = urlParams.get('canceled');

        if (success) {
            toast({
                title: "Success!",
                description: "Your subscription has been activated successfully.",
            });
            // Remove URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (canceled) {
            toast({
                title: "Cancelled",
                description: "Subscription process was cancelled.",
                variant: "destructive",
            });
            // Remove URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [toast]);

    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            await createPortalSession();
        } catch (error) {
            console.error('Error creating portal session:', error);
            toast({
                title: "Error",
                description: "Failed to open subscription management. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Current Plan Section */}
            <Card className="border-none shadow-none">
                <CardHeader className="p-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {t("currentPlan.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("currentPlan.description")}
                            </CardDescription>
                        </div>
                        <Button
                            onClick={handleManageSubscription}
                            variant="outline"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                t("currentPlan.manageSubscription")
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("currentPlan.status.active")}
                            </p>
                            <p className="text-lg font-semibold capitalize">
                                {t.raw(`plans.${currentSubscription.plan}.name`)}
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
                    </div>
                </CardContent>
            </Card>

            <Separator />

        </div>
    );
};
