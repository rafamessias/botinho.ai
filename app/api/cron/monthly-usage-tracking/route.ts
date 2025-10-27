import { NextRequest, NextResponse } from 'next/server';
import { createMonthlyUsageTrackingForYearlySubscriptions } from '@/lib/services/periodic-usage-tracking';

export async function GET(request: NextRequest) {
    // Verify the request is from your cron service (e.g., Vercel Cron)
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await createMonthlyUsageTrackingForYearlySubscriptions();

        return NextResponse.json({
            success: true,
            message: 'Monthly usage tracking created successfully'
        });
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create monthly usage tracking'
        }, { status: 500 });
    }
}