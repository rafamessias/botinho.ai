import { PrismaClient } from "@prisma/client";
import { FeatureType, BillingInterval } from "@/lib/generated/prisma"

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding subscription data...");

    // Create features
    const features = await Promise.all([
        prisma.feature.upsert({
            where: { name: "Projects" },
            update: {},
            create: {
                name: "Projects",
                description: "Number of projects you can create",
                type: FeatureType.projects,
                unit: "projects"
            }
        }),
    ]);

    console.log("✅ Features created:", features.map(f => f.name));

    // Get feature IDs for product creation
    const projectsFeature = features.find(f => f.type === FeatureType.projects)!;

    // Create products
    const products = await Promise.all([
        // Free tier
        prisma.product.upsert({
            where: { stripeProductId: "prod_free" },
            update: {},
            create: {
                stripeProductId: "prod_free",
                name: "Free",
                description: "Perfect for small teams getting started",
                billingInterval: BillingInterval.month,
                price: 0,
                currency: "usd",
                trialPeriodDays: 0,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 1 },
                    ]
                }
            }
        }),

        // Starter tier
        prisma.product.upsert({
            where: { stripeProductId: "prod_starter" },
            update: {},
            create: {
                stripeProductId: "prod_starter",
                name: "Starter",
                description: "Great for growing construction companies",
                billingInterval: BillingInterval.month,
                price: 29.99,
                currency: "usd",
                trialPeriodDays: 14,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 8 },
                    ]
                }
            }
        }),

        // Professional tier
        prisma.product.upsert({
            where: { stripeProductId: "prod_professional" },
            update: {},
            create: {
                stripeProductId: "prod_professional",
                name: "Professional",
                description: "For established construction companies",
                billingInterval: BillingInterval.month,
                price: 79.99,
                currency: "usd",
                trialPeriodDays: 14,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 16 },
                    ]
                }
            }
        }),

        // Enterprise tier
        prisma.product.upsert({
            where: { stripeProductId: "prod_enterprise" },
            update: {},
            create: {
                stripeProductId: "prod_enterprise",
                name: "Enterprise",
                description: "For large construction companies with unlimited needs",
                billingInterval: BillingInterval.month,
                price: 199.99,
                currency: "usd",
                trialPeriodDays: 14,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 24 },
                    ]
                }
            }
        })
    ]);

    console.log("✅ Products created:", products.map(p => p.name));

    // Create yearly versions of paid products
    const yearlyProducts = await Promise.all([
        prisma.product.upsert({
            where: { stripeProductId: "prod_starter_yearly" },
            update: {},
            create: {
                stripeProductId: "prod_starter_yearly",
                name: "Starter (Yearly)",
                description: "Great for growing construction companies - Save 20%",
                billingInterval: BillingInterval.year,
                price: 287.90, // 29.99 * 12 * 0.8 (20% discount)
                currency: "usd",
                trialPeriodDays: 14,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 8 },
                    ]
                }
            }
        }),

        prisma.product.upsert({
            where: { stripeProductId: "prod_professional_yearly" },
            update: {},
            create: {
                stripeProductId: "prod_professional_yearly",
                name: "Professional (Yearly)",
                description: "For established construction companies - Save 20%",
                billingInterval: BillingInterval.year,
                price: 767.90, // 79.99 * 12 * 0.8 (20% discount)
                currency: "usd",
                trialPeriodDays: 14,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 16 },
                    ]
                }
            }
        }),

        prisma.product.upsert({
            where: { stripeProductId: "prod_enterprise_yearly" },
            update: {},
            create: {
                stripeProductId: "prod_enterprise_yearly",
                name: "Enterprise (Yearly)",
                description: "For large construction companies - Save 20%",
                billingInterval: BillingInterval.year,
                price: 1919.90, // 199.99 * 12 * 0.8 (20% discount)
                currency: "usd",
                trialPeriodDays: 14,
                features: {
                    create: [
                        { featureId: projectsFeature.id, limit: 24 },
                    ]
                }
            }
        })
    ]);

    console.log("✅ Yearly products created:", yearlyProducts.map(p => p.name));

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

