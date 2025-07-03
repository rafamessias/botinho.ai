// app/api/logout/route.ts
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    cookieStore.set('jwt', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
