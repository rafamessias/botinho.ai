import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

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
        const { id, email_addresses, phone_numbers, first_name, last_name, image_url } = evt.data;

        const primaryEmail = email_addresses?.[0]?.email_address;
        const primaryPhone = phone_numbers?.[0]?.phone_number;

        if (!primaryEmail || !primaryPhone) {
            return new Response('Missing required user data', { status: 400 });
        }

        try {
            if (eventType === 'user.created') {
                await prisma.user.create({
                    data: {
                        clerkId: id,
                        email: primaryEmail,
                        phone: primaryPhone,
                        firstName: first_name || null,
                        lastName: last_name || null,
                        avatar: image_url || null,
                    },
                });
            } else {
                await prisma.user.update({
                    where: { clerkId: id },
                    data: {
                        email: primaryEmail,
                        phone: primaryPhone,
                        firstName: first_name || null,
                        lastName: last_name || null,
                        avatar: image_url || null,
                    },
                });
            }
        } catch (error) {
            console.error('Error syncing user data:', error);
            return new Response('Error syncing user data', { status: 500 });
        }
    }

    return new Response('Webhook processed successfully', { status: 200 });
} 