import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/app/auth';

export async function POST(request: NextRequest) {
    try {
        // Check authentication using NextAuth
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please sign in to upload files' },
                { status: 401 }
            );
        }

        // Optional: Add additional validation
        if (!session.user.email) {
            return NextResponse.json(
                { error: 'Invalid user session' },
                { status: 401 }
            );
        }

        const { folder = 'obraguru', resourceType = 'auto' } = await request.json();

        // Generate signed upload parameters
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Create the parameters object that will be signed
        // Only sign the essential parameters that Cloudinary requires
        const paramsToSign = {
            folder,
            timestamp
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        const response = {
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            folder,
            resourceType
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error generating signed upload params:', error);

        // Handle authentication errors specifically
        if (error instanceof Error && error.message.includes('auth')) {
            return NextResponse.json(
                { error: 'Authentication failed - Please sign in again' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate upload parameters' },
            { status: 500 }
        );
    }
}

// Optional: Add GET method for health check or testing
export async function GET() {
    return NextResponse.json(
        { message: 'Cloudinary sign endpoint is working' },
        { status: 200 }
    );
}
