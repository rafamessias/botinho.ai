import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/lib/prisma';
import { getStatusCodeForError, validateSubscriptionAndUsage, ValidationType } from '@/lib/services/subscription-validation';
import { getQuestionResponses } from '@/components/server-actions/survey';
import { SurveyStatus } from '@/lib/generated/prisma';

// CORS headers for API access
function addCorsHeaders(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}

// Validate API token (tokenApi)
async function validateApiToken(request: NextRequest): Promise<{ id: number } | null> {
    let token: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
    }

    if (!token) return null;

    const team = await prisma.team.findUnique({
        where: { tokenApi: token },
        select: { id: true }
    });

    if (!team) return null;

    return team;
}

export async function GET(request: NextRequest) {
    try {
        // Validate API token
        const team = await validateApiToken(request);
        if (!team) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Invalid API token' },
                { status: 401 }
            ));
        }

        // Get surveyId from query string
        const { searchParams } = new URL(request.url);
        const surveyId = searchParams.get('surveyId');

        if (!surveyId) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey ID is required' },
                { status: 400 }
            ));
        }

        // Validate subscription and usage limits for API export access
        const subscriptionValidation = await validateSubscriptionAndUsage(team.id, ValidationType.API_ACCESS);

        if (!subscriptionValidation.canProceed) {
            const errorCode = subscriptionValidation.error?.code;
            const statusCode = getStatusCodeForError(errorCode as any);

            return addCorsHeaders(NextResponse.json(
                {
                    error: subscriptionValidation.error?.message || 'Export data feature not available',
                    code: errorCode,
                    details: subscriptionValidation.error?.details,
                    usage: subscriptionValidation.usage,
                    subscription: subscriptionValidation.subscription
                },
                { status: statusCode }
            ));
        }

        // Verify survey exists and belongs to the team
        const survey = await prisma.survey.findFirst({
            where: {
                id: surveyId,
                teamId: team.id,
                status: {
                    in: [SurveyStatus.published, SurveyStatus.archived]
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                totalResponses: true,
                totalOpenSurveys: true,
                ResponseRate: true,
                status: true
            }
        });

        if (!survey) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey not found or access denied' },
                { status: 404 }
            ));
        }

        // Get question responses (raw data) for the survey
        const questionResponsesResult = await getQuestionResponses(surveyId);

        if (!questionResponsesResult.success) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Failed to fetch survey data' },
                { status: 500 }
            ));
        }

        const responses = questionResponsesResult.responses || [];

        // Format the data in the same structure as the dashboard export
        const formattedData = responses.map(response => ({
            userIP: response.response?.userIp || "",
            userId: response.response?.userId || "",
            extraInfo: response.response?.extraInfo || "",
            questionId: response.questionId || "",
            questionTitle: response.question?.title || "",
            questionFormat: response.question?.format || "",
            optionId: response.optionId || "",
            isOther: response.isOther || false,
            textValue: response.textValue || "",
            numberValue: response.numberValue || "",
            booleanValue: response.booleanValue || "",
            createdAt: response.response?.createdAt ? new Date(response.response.createdAt).toISOString() : ""
        }));

        // Return the survey results in the same format as dashboard export
        return addCorsHeaders(NextResponse.json({
            success: true,
            data: {
                survey: {
                    id: survey.id,
                    name: survey.name,
                    description: survey.description,
                    createdAt: survey.createdAt,
                    totalResponses: survey.totalResponses,
                    totalOpenSurveys: survey.totalOpenSurveys,
                    ResponseRate: survey.ResponseRate,
                    status: survey.status
                },
                results: formattedData,
                totalResponses: formattedData.length,
                exportedAt: new Date().toISOString()
            }
        }));

    } catch (error) {
        console.error('Error fetching survey results:', error);
        return addCorsHeaders(NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        ));
    }
}

export async function OPTIONS(request: NextRequest) {
    return addCorsHeaders(new NextResponse(null, { status: 200 }));
}