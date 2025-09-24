import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/lib/prisma';
import { z } from 'zod';
import { QuestionFormat, ResponseStatus, StyleMode, SurveyStyle } from '@/lib/generated/prisma';

function addCorsHeaders(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Team-Token');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
}

// Validation schema for survey answer submission
const surveyAnswerSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    userId: z.string().optional(),
    userIp: z.string().optional(),
    extraInfo: z.string().optional(),
    responses: z.array(z.object({
        questionId: z.string().min(1, 'Question ID is required'),
        questionTitle: z.string().min(1, 'Question Title is required'),
        questionFormat: z.nativeEnum(QuestionFormat).optional(),
        optionId: z.string().optional(),
        textValue: z.string().optional(),
        numberValue: z.number().optional(),
        booleanValue: z.boolean().optional(),
        isOther: z.boolean().optional().default(false)
    })).min(1, 'At least one response is required')
});

// Helper function to process question responses data
const processQuestionResponses = (responses: any[], surveyResponseId: string, teamId: number) => {
    const questionResponseData: any[] = [];

    for (const response of responses) {
        if (response.questionFormat === 'MULTIPLE_CHOICE') {
            const optionIds = response.optionId?.split(',') ?? [];
            const textValues = response.textValue?.split('_;_') ?? [];

            for (let i = 0; i < optionIds.length; i++) {
                questionResponseData.push({
                    questionId: response.questionId,
                    questionFormat: response.questionFormat,
                    questionTitle: response.questionTitle,
                    responseId: surveyResponseId,
                    teamId: teamId,
                    optionId: optionIds[i],
                    textValue: textValues[i],
                    numberValue: response.numberValue,
                    booleanValue: response.booleanValue,
                    isOther: response.isOther
                });
            }
        } else {
            questionResponseData.push({
                questionId: response.questionId,
                questionFormat: response.questionFormat,
                questionTitle: response.questionTitle,
                responseId: surveyResponseId,
                teamId: teamId,
                optionId: response.optionId,
                textValue: response.textValue,
                numberValue: response.numberValue,
                booleanValue: response.booleanValue,
                isOther: response.isOther
            });
        }
    }

    return questionResponseData;
};

// Helper function to process summary updates data
const processSummaryUpdates = (responses: any[], surveyResponseId: string, teamId: number, surveyId: string) => {
    const summaryUpdates: any[] = [];

    for (const response of responses) {
        if (response.questionFormat === 'MULTIPLE_CHOICE') {
            const optionIds = response.optionId?.split(',') ?? [];
            const textValues = response.textValue?.split('_;_') ?? [];

            for (let i = 0; i < optionIds.length; i++) {
                summaryUpdates.push({
                    surveyId,
                    questionId: response.questionId,
                    optionId: optionIds[i],
                    textValue: textValues[i],
                    questionTitle: response.questionTitle,
                    questionFormat: response.questionFormat,
                    isOther: response.isOther ?? false,
                    numberValue: response.numberValue ?? null,
                    booleanValue: response.booleanValue ?? null,
                    teamId,
                    responseId: surveyResponseId
                });
            }
        } else if (response.questionFormat === 'STAR_RATING') {
            summaryUpdates.push({
                surveyId,
                questionId: response.questionId,
                optionId: null,
                textValue: response.textValue ?? null,
                questionTitle: response.questionTitle,
                questionFormat: response.questionFormat,
                isOther: response.isOther ?? false,
                numberValue: response.numberValue ?? null,
                booleanValue: null,
                teamId,
                responseId: surveyResponseId
            });
        } else if (response.questionFormat === 'YES_NO') {
            summaryUpdates.push({
                surveyId,
                questionId: response.questionId,
                optionId: null,
                textValue: response.textValue ?? null,
                questionTitle: response.questionTitle,
                questionFormat: response.questionFormat,
                isOther: response.isOther ?? false,
                numberValue: null,
                booleanValue: response.booleanValue ?? null,
                teamId,
                responseId: surveyResponseId
            });
        } else if (response.questionFormat === 'SINGLE_CHOICE') {
            summaryUpdates.push({
                surveyId,
                questionId: response.questionId,
                optionId: response.optionId || null,
                textValue: response.textValue ?? null,
                questionTitle: response.questionTitle,
                questionFormat: response.questionFormat,
                isOther: response.isOther ?? false,
                numberValue: response.numberValue ?? null,
                booleanValue: response.booleanValue ?? null,
                teamId,
                responseId: surveyResponseId
            });
        }
    }

    return summaryUpdates;
};

export async function OPTIONS(request: NextRequest) {
    return addCorsHeaders(NextResponse.json({}));
}

export async function POST(request: NextRequest) {
    try {

        // Extract token from Authorization header (Bearer <token>), fallback to X-Team-Token header, fallback to body.teamToken
        let token: string | null = null;
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim();
        }

        // Fallback: try X-Team-Token header
        if (!token) {
            const xTeamToken = request.headers.get('x-team-token');
            if (xTeamToken) {
                token = xTeamToken.trim();
            }
        }

        // Fallback: try teamToken in body (for backward compatibility)
        if (!token) {
            // We need to parse the body to get teamToken, so parse it here and reuse below
            const body = await request.json();
            token = body.teamToken;
            // Re-assign body for later use
            request.json = async () => body;
        }

        if (!token) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Missing token in Authorization header, X-Team-Token header, or body' },
                { status: 401 }
            ));
        }

        const body = await request.json();

        // Validate request body
        const validatedData = surveyAnswerSchema.parse(body);

        // Validate team token and get team ID
        const team = await prisma.team.findUnique({
            where: { token: token },
            select: { id: true, name: true }
        });

        if (!team) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            ));
        }

        // Validate survey exists and belongs to the team
        const survey = await prisma.survey.findFirst({
            where: {
                id: validatedData.surveyId,
                teamId: team.id,
                status: 'published' // Only allow submissions to published surveys
            },
            select: {
                id: true,
                name: true,
                allowMultipleResponses: true,
                questions: {
                    select: { id: true, required: true, format: true }
                }
            }
        });

        if (!survey) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey not found or not published' },
                { status: 404 }
            ));
        }

        // Validate question IDs exist in the survey
        const surveyQuestionIds = survey.questions.map(q => q.id);
        const responseQuestionIds = validatedData.responses.map(r => r.questionId);

        const invalidQuestionIds = responseQuestionIds.filter(
            questionId => !surveyQuestionIds.includes(questionId)
        );

        if (invalidQuestionIds.length > 0) {
            return addCorsHeaders(NextResponse.json(
                { error: `Invalid question IDs: ${invalidQuestionIds.join(', ')}` },
                { status: 400 }
            ));
        }

        // Check for required questions that weren't answered
        const requiredQuestions = survey.questions.filter(q => q.required);
        const answeredQuestionIds = new Set(responseQuestionIds);
        const missingRequiredQuestions = requiredQuestions.filter(
            q => !answeredQuestionIds.has(q.id)
        );

        if (missingRequiredQuestions.length > 0) {
            return addCorsHeaders(NextResponse.json(
                {
                    error: `Missing required questions: ${missingRequiredQuestions.map(q => q.id).join(', ')}`
                },
                { status: 400 }
            ));
        }

        // If multiple responses are not allowed, check if user already submitted
        if (!survey.allowMultipleResponses) {
            // Note: In a real implementation, you might want to track by IP, user agent, or some other identifier
            // For now, we'll allow multiple submissions but this could be enhanced
        }

        // Create survey response and question responses in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create survey response
            const surveyResponse = await tx.surveyResponse.create({
                data: {
                    surveyId: validatedData.surveyId,
                    teamId: team.id,
                    status: ResponseStatus.completed,
                    submittedAt: new Date(),
                    userId: validatedData.userId || '',
                    userIp: validatedData.userIp || '',
                    extraInfo: validatedData.extraInfo || ''
                }
            });

            // Process question responses data for batch creation
            const questionResponseData = processQuestionResponses(
                validatedData.responses,
                surveyResponse.id,
                team.id
            );

            // Batch create all question responses
            const questionResponses = await tx.questionResponse.createMany({
                data: questionResponseData,
                skipDuplicates: true
            });

            // Process summary updates data
            const summaryUpdates = processSummaryUpdates(
                validatedData.responses,
                surveyResponse.id,
                team.id,
                validatedData.surveyId
            );

            // Batch update summaries using raw SQL for better performance
            const summaryPromises = summaryUpdates.map(async (summary) => {
                if (summary.numberValue !== null) {
                    // STAR_RATING - use numberValue unique key
                    return tx.$executeRaw`
                        INSERT INTO survey_response_summaries 
                        (id, "surveyId", "questionId", "optionId", "textValue", "questionTitle", "questionFormat", "isOther", "numberValue", "booleanValue", "teamId", "responseId", "responseCount", "lastUpdated")
                        VALUES (gen_random_uuid(), ${summary.surveyId}, ${summary.questionId}, ${summary.optionId}, ${summary.textValue}, ${summary.questionTitle}, ${summary.questionFormat}, ${summary.isOther}, ${summary.numberValue}, ${summary.booleanValue}, ${summary.teamId}, ${summary.responseId}, 1, NOW())
                        ON CONFLICT ("surveyId", "questionId", "numberValue", "teamId") 
                        DO UPDATE SET 
                            "responseCount" = survey_response_summaries."responseCount" + 1,
                            "lastUpdated" = NOW()
                    `;
                } else if (summary.booleanValue !== null) {
                    // YES_NO - use booleanValue unique key
                    return tx.$executeRaw`
                        INSERT INTO survey_response_summaries 
                        (id, "surveyId", "questionId", "optionId", "textValue", "questionTitle", "questionFormat", "isOther", "numberValue", "booleanValue", "teamId", "responseId", "responseCount", "lastUpdated")
                        VALUES (gen_random_uuid(), ${summary.surveyId}, ${summary.questionId}, ${summary.optionId}, ${summary.textValue}, ${summary.questionTitle}, ${summary.questionFormat}, ${summary.isOther}, ${summary.numberValue}, ${summary.booleanValue}, ${summary.teamId}, ${summary.responseId}, 1, NOW())
                        ON CONFLICT ("surveyId", "questionId", "booleanValue", "teamId") 
                        DO UPDATE SET 
                            "responseCount" = survey_response_summaries."responseCount" + 1,
                            "lastUpdated" = NOW()
                    `;
                } else {
                    // SINGLE_CHOICE, MULTIPLE_CHOICE - use optionId unique key
                    return tx.$executeRaw`
                        INSERT INTO survey_response_summaries 
                        (id, "surveyId", "questionId", "optionId", "textValue", "questionTitle", "questionFormat", "isOther", "numberValue", "booleanValue", "teamId", "responseId", "responseCount", "lastUpdated")
                        VALUES (gen_random_uuid(), ${summary.surveyId}, ${summary.questionId}, ${summary.optionId}, ${summary.textValue}, ${summary.questionTitle}, ${summary.questionFormat}, ${summary.isOther}, ${summary.numberValue}, ${summary.booleanValue}, ${summary.teamId}, ${summary.responseId}, 1, NOW())
                        ON CONFLICT ("surveyId", "questionId", "optionId", "teamId") 
                        DO UPDATE SET 
                            "responseCount" = survey_response_summaries."responseCount" + 1,
                            "lastUpdated" = NOW()
                    `;
                }
            });

            // Execute all summary updates in parallel
            await Promise.all(summaryPromises);

            // Update team response count
            await tx.team.update({
                where: { id: team.id },
                data: {
                    totalResponses: { increment: 1 }
                }
            });

            await tx.survey.update({
                where: { id: validatedData.surveyId },
                data: {
                    totalResponses: { increment: 1 }
                }
            });

            return {
                surveyResponse,
                questionResponses: { count: questionResponses.count },
                summaryUpdates: { count: summaryUpdates.length }
            };
        }, {
            timeout: 14000 // Increased timeout to 14 seconds
        });

        return addCorsHeaders(NextResponse.json({
            success: true,
            message: 'Survey response submitted successfully',
            data: {
                responseId: result?.surveyResponse.id,
                surveyId: validatedData.surveyId,
                teamName: team.name,
                submittedAt: result?.surveyResponse.submittedAt
            }
        }));

    } catch (error) {
        console.error('Error submitting survey response:', error);

        if (error instanceof z.ZodError) {
            return addCorsHeaders(NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                },
                { status: 400 }
            ));
        }

        return addCorsHeaders(NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        ));
    }
}

// Validation schema for getting survey data
const getSurveySchema = z.object({
    token: z.string().min(1, 'Token is required'),
    surveyId: z.string().min(1, 'Survey ID is required')
});

// Pseudocode plan:
// 1. Parse the surveyId from the query string as before.
// 2. Try to get the token from the Authorization header (Bearer <token>), fallback to X-Team-Token header, fallback to query param for backward compatibility.
// 3. Validate the token and surveyId using zod.
// 4. Continue with the same logic as before for fetching the team, survey, and returning the response.
// 5. If token is missing, return 401 with a clear error message.

export async function GET(request: NextRequest) {
    try {
        // Get surveyId from query string
        const { searchParams } = new URL(request.url);
        const surveyId = searchParams.get('surveyId');

        // Try to get token from Authorization header (Bearer <token>)
        let token: string | null = null;
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim();
        }

        // Fallback: try X-Team-Token header
        if (!token) {
            const xTeamToken = request.headers.get('x-team-token');
            if (xTeamToken) {
                token = xTeamToken.trim();
            }
        }

        // Fallback: try query param (for backward compatibility)
        if (!token) {
            token = searchParams.get('token');
        }

        if (!token) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Missing token in Authorization header, X-Team-Token header' },
                { status: 401 }
            ));
        }

        // Validate query parameters
        const validatedData = getSurveySchema.parse({ token, surveyId });

        // Validate team token and get team ID
        const team = await prisma.team.findUnique({
            where: { token: validatedData.token },
            select: { id: true, name: true }
        });

        if (!team) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            ));
        }

        // Get survey with questions and options
        const survey = await prisma.survey.findFirst({
            where: {
                id: validatedData.surveyId,
                teamId: team.id,
                status: 'published' // Only return published surveys
            },
            select: {
                id: true,
                style: {
                    select: {
                        styleMode: true,
                        advancedCSS: true,
                        basicCSS: true
                    }
                },
                questions: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        format: true,
                        required: true,
                        order: true,
                        yesLabel: true,
                        noLabel: true,
                        options: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                text: true,
                                order: true,
                                isOther: true
                            }
                        }
                    }
                }
            }
        });

        if (!survey) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey not found or not published' },
                { status: 404 }
            ));
        }

        const { advancedCSS, styleMode, basicCSS } = survey.style as SurveyStyle;
        const customCSS = styleMode === StyleMode.advanced ? advancedCSS : basicCSS;

        return addCorsHeaders(NextResponse.json({
            success: true,
            data: {
                id: survey.id,
                style: customCSS,
                questions: survey.questions
            }
        }));

    } catch (error) {
        console.error('Error fetching survey:', error);

        if (error instanceof z.ZodError) {
            return addCorsHeaders(NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                },
                { status: 400 }
            ));
        }

        return addCorsHeaders(NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        ));
    }
}