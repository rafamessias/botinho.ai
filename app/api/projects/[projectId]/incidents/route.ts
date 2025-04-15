import { NextRequest, NextResponse } from 'next/server';
import { IncidentService } from '@/lib/services';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const projectId = params.projectId;
        const data = await request.json();

        // Add the author ID to the data
        data.authorId = userId;

        const incidentService = new IncidentService();
        const incident = await incidentService.createIncident(projectId, data);

        return NextResponse.json(incident);
    } catch (error: any) {
        console.error('Error creating incident:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create incident' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const projectId = params.projectId;
        const incidentService = new IncidentService();
        const incidents = await incidentService.getIncidentsByProject(projectId);

        return NextResponse.json(incidents);
    } catch (error: any) {
        console.error('Error fetching incidents:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch incidents' },
            { status: 500 }
        );
    }
} 