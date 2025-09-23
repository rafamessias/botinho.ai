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

            // Create question responses
            const questionResponses: any[] = [];
            const surveyResponseSummaries: any[] = [];
            for (const response of validatedData.responses) {
                // If the response is for a MULTIPLE_CHOICE question, split questionId and textValue and save each separately
                if (response.questionFormat === 'MULTIPLE_CHOICE') {
                    // Save a questionResponse for each selected value
                    const optionIds = response.optionId?.split(',') ?? [];
                    const textValues = response.textValue?.split('_;_') ?? [];
                    for (let i = 0; i < optionIds.length; i++) {
                        const questionResponse = await tx.questionResponse.create({
                            data: {
                                questionId: response.questionId,
                                responseId: surveyResponse.id,
                                teamId: team.id,
                                optionId: optionIds[i],
                                textValue: textValues[i],
                                numberValue: response.numberValue,
                                booleanValue: response.booleanValue,
                                isOther: response.isOther
                            }
                        });
                        questionResponses.push(questionResponse);
                    }
                } else {
                    // Default: save as single response
                    const questionResponse = await tx.questionResponse.create({
                        data: {
                            questionId: response.questionId,
                            responseId: surveyResponse.id,
                            teamId: team.id,
                            optionId: response.optionId,
                            textValue: response.textValue,
                            numberValue: response.numberValue,
                            booleanValue: response.booleanValue,
                            isOther: response.isOther
                        }
                    });
                    questionResponses.push(questionResponse);
                }

                // For each question response, create or update SurveyResponseSummary
                // - If optionId exists, summary is per (surveyId, questionId, optionId, teamId)
                // - If optionId is null, summary is per (surveyId, questionId, null, teamId)
                // - responseId is the surveyResponse.id just created

                // Use a Set to avoid duplicate (questionId, optionId) in the same submission
                console.log('validatedData.responses', validatedData.responses);
                for (const response of validatedData.responses) {
                    // Determine which unique key to use based on response type
                    let whereClause: any;
                    let summaryKey: string;

                    if (response.questionFormat === 'STAR_RATING') {
                        // Use numberValue unique key
                        whereClause = {
                            surveyId_questionId_numberValue_teamId: {
                                surveyId: validatedData.surveyId,
                                questionId: response.questionId,
                                numberValue: response.numberValue,
                                teamId: team.id
                            }
                        };
                        summaryKey = `${validatedData.surveyId}|${response.questionId}|number:${response.numberValue}|${team.id}`;
                    } else if (response.questionFormat === 'YES_NO') {
                        // Use booleanValue unique key
                        whereClause = {
                            surveyId_questionId_booleanValue_teamId: {
                                surveyId: validatedData.surveyId,
                                questionId: response.questionId,
                                booleanValue: response.booleanValue,
                                teamId: team.id
                            }
                        };
                        summaryKey = `${validatedData.surveyId}|${response.questionId}|boolean:${response.booleanValue}|${team.id}`;
                    } else if (response.questionFormat === 'SINGLE_CHOICE') {
                        // Use optionId unique key (default)
                        whereClause = {
                            surveyId_questionId_optionId_teamId: {
                                surveyId: validatedData.surveyId,
                                questionId: response.questionId,
                                optionId: response.optionId || null,
                                teamId: team.id
                            }
                        };
                        summaryKey = `${validatedData.surveyId}|${response.questionId}|option:${response.optionId ?? 'null'}|${team.id}`;
                    } else if (response.questionFormat === 'MULTIPLE_CHOICE') {
                        // Use textValue unique key (default)
                        const optionIds = response.optionId?.split(',') ?? [];
                        const textValues = response.textValue?.split('_;_') ?? [];
                        for (let i = 0; i < optionIds.length; i++) {
                            whereClause = {
                                surveyId_questionId_optionId_teamId: {
                                    surveyId: validatedData.surveyId,
                                    questionId: response.questionId,
                                    optionId: optionIds[i],
                                    teamId: team.id
                                }
                            };

                            const summary = await tx.surveyResponseSummary.upsert({
                                where: whereClause,
                                update: {
                                    responseCount: { increment: 1 },
                                    lastUpdated: new Date()
                                },
                                create: {
                                    surveyId: validatedData.surveyId,
                                    questionId: response.questionId,
                                    optionId: response.optionId || null,
                                    isOther: response.isOther ?? false,
                                    numberValue: response.numberValue ?? null,
                                    booleanValue: response.booleanValue ?? null,
                                    textValue: textValues[i] ?? null,
                                    questionTitle: response.questionTitle ?? null,
                                    teamId: team.id,
                                    responseCount: 1,
                                    lastUpdated: new Date(),
                                    responseId: surveyResponse.id
                                }
                            });
                            summaryKey = `${validatedData.surveyId}|${response.questionId}|option:${optionIds[i]}|${team.id}`;
                            surveyResponseSummaries.push(summary);

                        }
                        return;
                    } else {
                        return;
                    }

                    const summary = await tx.surveyResponseSummary.upsert({
                        where: whereClause,
                        update: {
                            responseCount: { increment: 1 },
                            lastUpdated: new Date()
                        },
                        create: {
                            surveyId: validatedData.surveyId,
                            questionId: response.questionId,
                            optionId: response.optionId || null,
                            textValue: response.textValue ?? null,
                            questionTitle: response.questionTitle ?? null,
                            isOther: response.isOther ?? false,
                            numberValue: response.numberValue ?? null,
                            booleanValue: response.booleanValue ?? null,
                            teamId: team.id,
                            responseCount: 1,
                            lastUpdated: new Date(),
                            responseId: surveyResponse.id
                        }
                    });

                    surveyResponseSummaries.push(summary);
                }
            }

            // Update team response count
            await tx.team.update({
                where: { id: team.id },
                data: {
                    totalResponses: { increment: 1 }
                }
            });

            return { surveyResponse, questionResponses, surveyResponseSummaries };
        }, {
            timeout: 10000 // 10 seconds timeout
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
        const style = styleMode === StyleMode.advanced ? { customCSS: advancedCSS } : { customCSS: basicCSS };

        return addCorsHeaders(NextResponse.json({
            success: true,
            data: {
                survey: {
                    id: survey.id,
                    style: style,
                    questions: survey.questions
                }
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