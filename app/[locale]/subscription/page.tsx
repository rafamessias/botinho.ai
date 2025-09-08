import { getTranslations } from "next-intl/server";
import { SubscriptionPage } from "@/components/subscription/subscription-page";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

export default async function Subscription() {
    const t = await getTranslations("Subscription");

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={t("title")} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2 max-w-4xl w-full mx-auto">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <p className="text-muted-foreground text-lg">
                                {t("description")}
                            </p>

                            <SubscriptionPage />
                        </div>
                    </div>
                </div>
            </SidebarInset>

        </SidebarProvider>
    );
}
