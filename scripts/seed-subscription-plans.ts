import { PrismaClient, PlanType, BillingInterval } from '../lib/generated/prisma'

const prisma = new PrismaClient()

const subscriptionPlans = [
    {
        planType: PlanType.FREE,
        stripeProductId: 'prod_TAgDkZRIMFOsa1',
        stripePriceIdMonthly: 'price_1SEKrBPKFv7WSzQIoLloEIN6',
        stripePriceIdYearly: 'price_1SEKrBPKFv7WSzQIoLloEIN6',
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'USD',
        maxActiveSurveys: 1,
        maxResponses: 100,
        maxCompletedResponses: 100,
        removeBranding: false,
        allowApiAccess: false,
        allowExport: false,
        allowPublicPages: false,
        isActive: true,
    },
    {
        planType: PlanType.STARTER,
        stripeProductId: 'prod_TAgF21C9caB3BU',
        stripePriceIdMonthly: 'price_1SEKsmPKFv7WSzQIUJPfH7qB',
        stripePriceIdYearly: 'price_1SEKsmPKFv7WSzQIy0BEdVt7',
        priceMonthly: 9,
        priceYearly: 86.4,
        currency: 'USD',
        maxActiveSurveys: 3,
        maxResponses: 500,
        maxCompletedResponses: 500,
        removeBranding: false,
        allowApiAccess: false,
        allowExport: false,
        allowPublicPages: false,
        isActive: true,
    },
    {
        planType: PlanType.PRO,
        stripeProductId: 'prod_TAgH9yhCrxZfAE',
        stripePriceIdMonthly: 'price_1SEKucPKFv7WSzQIEVrHOh25',
        stripePriceIdYearly: 'price_1SEKucPKFv7WSzQI3DlzV603',
        priceMonthly: 29,
        priceYearly: 278.4,
        currency: 'USD',
        maxActiveSurveys: 10,
        maxResponses: 5000,
        maxCompletedResponses: 5000,
        removeBranding: true,
        allowApiAccess: false,
        allowExport: true,
        allowPublicPages: false,
        isActive: true,
    },
    {
        planType: PlanType.BUSINESS,
        stripeProductId: 'prod_TAgIe59lz761bX',
        stripePriceIdMonthly: 'price_1SEKvbPKFv7WSzQIadS49E2l',
        stripePriceIdYearly: 'price_1SEKwYPKFv7WSzQInMLYW43f',
        priceMonthly: 99,
        priceYearly: 950.4,
        currency: 'USD',
        maxActiveSurveys: 25,
        maxResponses: 20000,
        maxCompletedResponses: 20000,
        removeBranding: true,
        allowApiAccess: true,
        allowExport: true,
        allowPublicPages: true,
        isActive: true,
    },
]

async function seedSubscriptionPlans() {
    try {
        console.log('Starting subscription plans seeding...')

        // Clear existing subscription plans
        await prisma.subscriptionPlan.deleteMany()
        console.log('Cleared existing subscription plans')

        // Create new subscription plans using createMany for efficiency
        const createdPlans = await prisma.subscriptionPlan.createMany({
            data: subscriptionPlans,
            skipDuplicates: true,
        })
        console.log(`Created ${createdPlans.count} subscription plans`)

        console.log('Subscription plans seeding completed successfully!')
    } catch (error) {
        console.error('Error seeding subscription plans:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the seed function
seedSubscriptionPlans()
    .catch((error) => {
        console.error('Seed script failed:', error)
        process.exit(1)
    })
