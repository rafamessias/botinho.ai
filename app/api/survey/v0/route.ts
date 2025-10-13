import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/lib/prisma';
import { z } from 'zod';
import { QuestionFormat, ResponseStatus, StyleMode, Survey, SurveyStyle, UsageMetricType } from '@/lib/generated/prisma';
import { validateSubscriptionAndUsage, getStatusCodeForError, invalidateSubscriptionCache } from '@/lib/services/subscription-validation';
import { updateUsageTrackingInTransaction } from '@/lib/services/usage-tracking';
import { checkBotId } from 'botid/server';

// Simple in-memory cache for survey data (in production, consider Redis)
const surveyCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1 * 60 * 1000; // 1 minutes cache TTL


// Helper function to get cached survey or fetch from database
const getCachedSurvey = async (surveyId: string, teamId: number) => {
    const cacheKey = `${surveyId}-${teamId}`;
    const cached = surveyCache.get(cacheKey);

    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    // Fetch from database
    const survey = await prisma.survey.findFirst({
        where: {
            id: surveyId,
            teamId: teamId,
            status: 'published'
        },
        select: {
            id: true,
            totalOpenSurveys: true,
            totalResponses: true,
            responseRate: true,
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

    // Cache the result if found
    if (survey) {
        surveyCache.set(cacheKey, { data: survey, timestamp: Date.now() });
    }

    return survey;
};

// Helper function to invalidate cache for a specific survey
const invalidateSurveyCache = (surveyId: string) => {
    const keysToDelete = Array.from(surveyCache.keys()).filter(key => key.startsWith(`${surveyId}-`));
    keysToDelete.forEach(key => surveyCache.delete(key));
};

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
    responseToken: z.string().min(1, 'Response Token is required'),
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
        answers: z.array(z.object({
            optionId: z.string().optional(),
            textValue: z.string().optional(),
            isOther: z.boolean().optional().default(false)
        })).optional(),
        isOther: z.boolean().optional().default(false)
    })).min(1, 'At least one response is required')
});

// Optimized helper function that processes both question responses and summary updates in a single pass
const processResponseData = (responses: any[], surveyResponseId: string, teamId: number, surveyId: string) => {
    const questionResponseData: any[] = [];
    const summaryUpdates: any[] = [];

    // Single loop to process both arrays
    for (const response of responses) {
        const baseData = {
            questionId: response.questionId,
            questionFormat: response.questionFormat,
            questionTitle: response.questionTitle,
            responseId: surveyResponseId,
            teamId: teamId,
            isOther: response.isOther || false
        };

        if (response.questionFormat === 'MULTIPLE_CHOICE' && response.answers) {
            // Process multiple choice answers
            for (const answer of response.answers) {
                const questionResponse = {
                    ...baseData,
                    optionId: answer.optionId,
                    textValue: answer.textValue,
                    numberValue: response.numberValue,
                    booleanValue: response.booleanValue,
                    isOther: answer.isOther
                };
                questionResponseData.push(questionResponse);

                // Add to summary updates
                summaryUpdates.push({
                    surveyId,
                    questionId: response.questionId,
                    optionId: answer.optionId,
                    textValue: answer.textValue,
                    questionTitle: response.questionTitle,
                    questionFormat: response.questionFormat,
                    isOther: answer.isOther ?? false,
                    numberValue: response.numberValue ?? null,
                    booleanValue: response.booleanValue ?? null,
                    teamId,
                    responseId: surveyResponseId
                });
            }
        } else {
            // Process single response
            const questionResponse = {
                ...baseData,
                optionId: response.optionId || null,
                textValue: response.textValue,
                numberValue: response.numberValue,
                booleanValue: response.booleanValue
            };
            questionResponseData.push(questionResponse);

            // Add to summary updates based on question format
            if (response.questionFormat === 'STAR_RATING') {
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
    }

    return { questionResponseData, summaryUpdates };
};

// Optimized summary update function using individual operations for safety
const executeBatchSummaryUpdates = async (tx: any, summaryUpdates: any[]) => {
    if (summaryUpdates.length === 0) return;

    // Execute summary updates in parallel but individually for safety
    const summaryPromises = summaryUpdates.map(async (summary) => {
        if (summary.numberValue !== null) {
            // STAR_RATING - use numberValue unique key
            return tx.$executeRaw`
                INSERT INTO survey_response_summaries 
                (id, "surveyId", "questionId", "optionId", "textValue", "questionTitle", "questionFormat", "isOther", "numberValue", "booleanValue", "teamId", "responseId", "responseCount", "lastUpdated")
                VALUES (gen_random_uuid(), ${summary.surveyId}, ${summary.questionId}, ${summary.optionId}, ${summary.textValue}, ${summary.questionTitle}, ${summary.questionFormat}::"QuestionFormat", ${summary.isOther}, ${summary.numberValue}, ${summary.booleanValue}, ${summary.teamId}, ${summary.responseId}, 1, NOW())
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
                VALUES (gen_random_uuid(), ${summary.surveyId}, ${summary.questionId}, ${summary.optionId}, ${summary.textValue}, ${summary.questionTitle}, ${summary.questionFormat}::"QuestionFormat", ${summary.isOther}, ${summary.numberValue}, ${summary.booleanValue}, ${summary.teamId}, ${summary.responseId}, 1, NOW())
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
                VALUES (gen_random_uuid(), ${summary.surveyId}, ${summary.questionId}, ${summary.optionId}, ${summary.textValue}, ${summary.questionTitle}, ${summary.questionFormat}::"QuestionFormat", ${summary.isOther}, ${summary.numberValue}, ${summary.booleanValue}, ${summary.teamId}, ${summary.responseId}, 1, NOW())
                ON CONFLICT ("surveyId", "questionId", "optionId", "teamId") 
                DO UPDATE SET 
                    "responseCount" = survey_response_summaries."responseCount" + 1,
                    "lastUpdated" = NOW()
            `;
        }
    });

    // Execute all summary updates in parallel
    await Promise.all(summaryPromises);
};

export async function OPTIONS(request: NextRequest) {
    return addCorsHeaders(NextResponse.json({}));
}


async function validateToken(request: NextRequest): Promise<{ id: number, branding: boolean } | null> {
    let token: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
    }

    if (!token) return null;

    const team = await prisma.team.findUnique({
        where: { tokenSurvery: token },
        select: { id: true, branding: true }
    });

    if (!team) return null;

    return team;
}

export async function POST(request: NextRequest) {
    try {

        const verification = await checkBotId();

        if (verification.isBot) {
            return addCorsHeaders(NextResponse.json({ error: 'Access denied' }, { status: 403 }));
        }
        // Early token validation
        const team = await validateToken(request);
        if (!team) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            ));
        }

        // PERFORMANCE OPTIMIZATION: Validate subscription and usage limits early
        // This prevents unnecessary processing if the team has exceeded their limits
        const subscriptionValidation = await validateSubscriptionAndUsage(team.id);

        if (!subscriptionValidation.canProceed) {
            const errorCode = subscriptionValidation.error?.code;
            const statusCode = getStatusCodeForError(errorCode as any);

            return addCorsHeaders(NextResponse.json(
                {
                    error: subscriptionValidation.error?.message || 'Subscription limit exceeded',
                },
                { status: statusCode }
            ));
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = surveyAnswerSchema.parse(body);

        // Single optimized query to get survey with validation data
        const surveyResponse = await prisma.surveyResponse.findFirst({
            where: {
                id: validatedData.responseToken,
                surveyId: validatedData.surveyId,
                origin: request.headers.get('origin') || '',
                status: 'pending',
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                survey: {
                    select: {
                        id: true,
                        totalOpenSurveys: true,
                        totalResponses: true,
                        responseRate: true,
                        questions: {
                            select: {
                                id: true,
                                required: true,
                                format: true
                            }
                        }
                    }
                }
            },

        });

        if (!surveyResponse) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey response not found or expired' },
                { status: 404 }
            ));
        }

        const survey = surveyResponse.survey;

        // Optimized validation in single pass
        const surveyQuestionIds = new Set(survey.questions.map(q => q.id));
        const responseQuestionIds = new Set(validatedData.responses.map(r => r.questionId));

        // Check for invalid question IDs
        const invalidQuestionIds = validatedData.responses
            .filter(r => !surveyQuestionIds.has(r.questionId))
            .map(r => r.questionId);

        if (invalidQuestionIds.length > 0) {
            return addCorsHeaders(NextResponse.json(
                { error: `Invalid question IDs: ${invalidQuestionIds.join(', ')}` },
                { status: 400 }
            ));
        }

        // Check for missing required questions
        const requiredQuestionIds = new Set(survey.questions.filter(q => q.required).map(q => q.id));
        const missingRequiredQuestions = Array.from(requiredQuestionIds)
            .filter(id => !responseQuestionIds.has(id));

        if (missingRequiredQuestions.length > 0) {
            return addCorsHeaders(NextResponse.json(
                { error: `Missing required questions: ${missingRequiredQuestions.join(', ')}` },
                { status: 400 }
            ));
        }

        // Process response data in single pass
        const { questionResponseData, summaryUpdates } = processResponseData(
            validatedData.responses,
            '', // Will be set in transaction
            team.id,
            survey.id
        );

        // Optimized transaction with batch operations
        await prisma.$transaction(async (tx) => {
            // Create survey response
            await tx.surveyResponse.update({
                where: { id: surveyResponse.id },
                data: {
                    status: ResponseStatus.completed,
                    submittedAt: new Date(),
                    userId: validatedData.userId || '',
                    userIp: request.headers.get('x-forwarded-for') || '',
                    extraInfo: validatedData.extraInfo || '',
                    origin: request.headers.get('origin') || ''
                }
            });

            // Update response IDs in the data
            questionResponseData.forEach(item => item.responseId = surveyResponse.id);
            summaryUpdates.forEach(item => item.responseId = surveyResponse.id);

            // Batch create all question responses
            const questionResponses = await tx.questionResponse.createMany({
                data: questionResponseData,
                skipDuplicates: true
            });

            // Execute batch summary updates
            await executeBatchSummaryUpdates(tx, summaryUpdates);

            // Update usage tracking within the transaction
            await updateUsageTrackingInTransaction(tx, team.id, subscriptionValidation.subscription.id);

            return {
                surveyResponse,
                questionResponses: { count: questionResponses.count },
                summaryUpdates: { count: summaryUpdates.length }
            };
        }, {
            timeout: 10000 // Reduced timeout since we're more efficient
        });

        // Update totalOpenSurveys and ResponseRate for the survey
        await updateSurveyStats(survey.id, 0, 1, team.id); // increment responses by 1

        // Invalidate caches after successful submission
        invalidateSurveyCache(survey.id);
        invalidateSubscriptionCache(team.id);

        return addCorsHeaders(NextResponse.json({
            success: true,
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

// Pseudocode plan:
// 1. Parse the surveyId from the query string as before.
// 2. Try to get the token from the Authorization header (Bearer <token>), fallback to X-Team-Token header, fallback to query param for backward compatibility.
// 3. Validate the token and surveyId using zod.
// 4. Continue with the same logic as before for fetching the team, survey, and returning the response.
// 5. If token is missing, return 401 with a clear error message.

export async function GET(request: NextRequest) {
    try {

        const verification = await checkBotId();

        if (verification.isBot) {
            return addCorsHeaders(NextResponse.json({ error: 'Access denied' }, { status: 403 }));
        }

        const team = await validateToken(request);

        if (!team) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            ));
        }

        // Get surveyId from query string
        const { searchParams } = new URL(request.url);
        const surveyId = searchParams.get('surveyId') || null;

        if (!surveyId) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey ID is required' },
                { status: 400 }
            ));
        }


        // PERFORMANCE OPTIMIZATION: Validate subscription and usage limits early
        // This prevents unnecessary processing if the team has exceeded their limits
        const subscriptionValidation = await validateSubscriptionAndUsage(team.id);

        if (!subscriptionValidation.canProceed) {
            const errorCode = subscriptionValidation.error?.code;
            const statusCode = getStatusCodeForError(errorCode as any);

            return addCorsHeaders(NextResponse.json(
                {
                    error: subscriptionValidation.error?.message || 'Subscription limit exceeded',
                },
                { status: statusCode }
            ));
        }


        // PERFORMANCE OPTIMIZATION: Use cached survey data with single query
        // This reduces database round trips and provides caching benefits
        const survey = await getCachedSurvey(surveyId, team.id);

        // If survey not found, it could be due to invalid token or survey not found
        if (!survey) {
            return addCorsHeaders(NextResponse.json(
                { error: 'Survey not found or not published' },
                { status: 404 }
            ));
        }

        // PERFORMANCE OPTIMIZATION: Process style data more efficiently
        const { advancedCSS, styleMode, basicCSS } = survey.style as SurveyStyle;
        const customCSS = styleMode === StyleMode.advanced ? advancedCSS : basicCSS;

        // 5 minutes from now
        const expiresAt = new Date(Date.now() + 1000 * 60 * 5);
        //const expiresAt = new Date(Date.now() + 1000 * 10);

        // Create a new survey response for this survey and team
        const newSurveyResponse = await prisma.surveyResponse.create({
            data: {
                surveyId: survey.id,
                teamId: team.id,
                status: ResponseStatus.pending,
                userIp: request.headers.get('x-forwarded-for') || "",
                origin: request.headers.get('origin') || "",
                expiresAt: expiresAt,
            },
            select: {
                id: true,
            }
        });

        // Update totalOpenSurveys and ResponseRate for the survey
        await updateSurveyStats(survey.id, 1, 0, team.id); // increment open surveys by 1

        return addCorsHeaders(NextResponse.json({
            success: true,
            data: {
                responseToken: newSurveyResponse.id,
                style: customCSS,
                questions: survey.questions,
                branding: team.branding
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

async function updateSurveyStats(
    id: string,
    incrementOpenSurveys: number,
    incrementResponses: number,
    teamId: number
) {
    // Use atomic increment operations and calculate response rate in the same query
    await prisma.$executeRaw`
    UPDATE surveys
    SET 
      "totalOpenSurveys" = "totalOpenSurveys" + ${incrementOpenSurveys},
      "totalResponses" = "totalResponses" + ${incrementResponses},
      "responseRate" = CASE 
        WHEN ("totalOpenSurveys" + ${incrementOpenSurveys}) > 0 
        THEN (
            ("totalResponses" + ${incrementResponses})::FLOAT / 
            ("totalOpenSurveys" + ${incrementOpenSurveys})::FLOAT) * 100
        ELSE 0
      END
    WHERE id = ${id}
  `;

    // Update team stats atomically with direct increments
    await prisma.$executeRaw`
    UPDATE teams
    SET 
      "totalOpenSurveys" = "totalOpenSurveys" + ${incrementOpenSurveys},
      "totalResponses" = "totalResponses" + ${incrementResponses},
      "responseRate" = CASE 
        WHEN ("totalOpenSurveys" + ${incrementOpenSurveys}) > 0
        THEN (
          ("totalResponses" + ${incrementResponses})::FLOAT / 
          ("totalOpenSurveys" + ${incrementOpenSurveys})::FLOAT
        ) * 100
        ELSE 0
      END
    WHERE id = ${teamId}
  `;
}