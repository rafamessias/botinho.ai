import { NextRequest, NextResponse } from 'next/server';
import { RdoService } from '@/lib/services';
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

        const rdoService = new RdoService();
        const rdo = await rdoService.createRDO(projectId, data);

        return NextResponse.json(rdo);
    } catch (error: any) {
        console.error('Error creating RDO:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create RDO' },
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
        const rdoService = new RdoService();
        const rdos = await rdoService.getRDOsByProject(projectId);

        return NextResponse.json(rdos);
    } catch (error: any) {
        console.error('Error fetching RDOs:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch RDOs' },
            { status: 500 }
        );
    }
} 