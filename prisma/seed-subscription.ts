import { PrismaClient, PlanType } from "@/lib/generated/prisma"

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding subscription plans...");

    // Create subscription plans
    const plans = await Promise.all([
        // FREE plan
        prisma.subscriptionPlan.upsert({
            where: { id: "plan_free" },
            update: {},
            create: {
                id: "plan_free",
                planType: PlanType.FREE,
                priceMonthly: 0,
                priceYearly: 0,
                currency: "USD",
                maxActiveSurveys: 1,
                maxResponses: 100,
                maxCompletedResponses: 100,
                removeBranding: false,
                allowApiAccess: false,
                allowExport: false,
                allowPublicPages: false,
                isActive: true
            }
        }),

        // STARTER plan - Perfect for individuals and small teams
        prisma.subscriptionPlan.upsert({
            where: { id: "plan_starter" },
            update: {},
            create: {
                id: "plan_starter",
                planType: PlanType.STARTER,
                stripeProductId: "prod_TEK33oxuKeM6cT",
                stripePriceIdMonthly: "price_1SHrPWPOKcl3oL4etYfXBBcP",
                stripePriceIdYearly: "price_1SHrPWPOKcl3oL4euYyPkEyR",
                priceMonthly: 9.00,
                priceYearly: 86.40, // $9 * 12 * 0.8 (20% discount)
                currency: "USD",
                maxActiveSurveys: 3,
                maxResponses: 500,
                maxCompletedResponses: 500,
                removeBranding: false,
                allowApiAccess: false,
                allowExport: false,
                allowPublicPages: false,
                isActive: true
            }
        }),

        // PRO plan - Ideal for growing businesses (Most Popular)
        prisma.subscriptionPlan.upsert({
            where: { id: "plan_pro" },
            update: {},
            create: {
                id: "plan_pro",
                planType: PlanType.PRO,
                stripeProductId: "prod_TEK3qXu6yPpWX2",
                stripePriceIdMonthly: "price_1SHrPTPOKcl3oL4e7iVaraLr",
                stripePriceIdYearly: "price_1SHrPTPOKcl3oL4ejq0pz5YS",
                priceMonthly: 29.00,
                priceYearly: 278.40, // $29 * 12 * 0.8 (20% discount)
                currency: "USD",
                maxActiveSurveys: 10,
                maxResponses: 5000,
                maxCompletedResponses: 5000,
                removeBranding: true,
                allowApiAccess: false,
                allowExport: true,
                allowPublicPages: false,
                isActive: true
            }
        }),

        // BUSINESS plan - For organizations and teams
        prisma.subscriptionPlan.upsert({
            where: { id: "plan_business" },
            update: {},
            create: {
                id: "plan_business",
                planType: PlanType.BUSINESS,
                stripeProductId: "prod_TEK3rXZOUXQoGL",
                stripePriceIdMonthly: "price_1SHrPPPOKcl3oL4eOcwPviZR",
                stripePriceIdYearly: "price_1SHrPPPOKcl3oL4e3IGcZKlh",
                priceMonthly: 99.00,
                priceYearly: 950.40, // $99 * 12 * 0.8 (20% discount)
                currency: "USD",
                maxActiveSurveys: 25,
                maxResponses: 20000,
                maxCompletedResponses: 20000,
                removeBranding: true,
                allowApiAccess: true,
                allowExport: true,
                allowPublicPages: true,
                isActive: true
            }
        }),

        // ENTERPRISE plan - Custom enterprise solutions
        prisma.subscriptionPlan.upsert({
            where: { id: "plan_enterprise" },
            update: {},
            create: {
                id: "plan_enterprise",
                planType: PlanType.ENTERPRISE,
                stripeProductId: "prod_enterprise",
                stripePriceIdMonthly: "",
                stripePriceIdYearly: "",
                priceMonthly: 499.00,
                priceYearly: 4790.40, // $499 * 12 * 0.8 (20% discount)
                currency: "USD",
                maxActiveSurveys: -1, // unlimited
                maxResponses: -1, // unlimited
                maxCompletedResponses: -1, // unlimited
                removeBranding: true,
                allowApiAccess: true,
                allowExport: true,
                allowPublicPages: true,
                isActive: true
            }
        })
    ]);

    console.log("✅ Subscription plans created:", plans.map(p => p.planType));

    console.log("🎉 Subscription seeding completed!");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding subscription data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

