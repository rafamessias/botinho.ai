import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    // Get the headers
    const headersList = await headers();
    const svix_id = headersList.get("svix-id") ?? '';
    const svix_timestamp = headersList.get("svix-timestamp") ?? '';
    const svix_signature = headersList.get("svix-signature") ?? '';

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    let evt: WebhookEvent;

    // Verify the webhook
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name } = evt.data;

        const primaryEmail = email_addresses?.[0]?.email_address;

        if (!primaryEmail) {
            return new Response('No email address found', { status: 400 });
        }

        await prisma.user.upsert({
            where: { clerkId: id },
            create: {
                clerkId: id,
                email: primaryEmail,
                firstName: first_name || null,
                lastName: last_name || null,
            },
            update: {
                email: primaryEmail,
                firstName: first_name || null,
                lastName: last_name || null,
            },
        });
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        await prisma.user.delete({
            where: { clerkId: id },
        });
    }

    return new Response('Webhook processed successfully', { status: 200 });
} 