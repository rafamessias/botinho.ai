// app/api/logout/route.ts
export const runtime = 'nodejs';

import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    cookieStore.set('jwt', '', {
        expires: new Date(0),
        path: '/',
        domain: process.env.HOST || 'localhost',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return new Response('ok', {
        status: 200,
        headers: {
            'Set-Cookie': 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure',
        },
    });
}
