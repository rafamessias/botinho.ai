import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/lib/prisma';
import { z } from 'zod';
import { ResponseStatus } from '@/lib/generated/prisma';

// Validation schema for survey answer submission
const surveyAnswerSchema = z.object({
    teamToken: z.string().min(1, 'Team token is required'),
    surveyId: z.string().min(1, 'Survey ID is required'),
    responses: z.array(z.object({
        questionId: z.string().min(1, 'Question ID is required'),
        optionId: z.string().optional(),
        textValue: z.string().optional(),
        numberValue: z.number().optional(),
        booleanValue: z.boolean().optional(),
        isOther: z.boolean().optional().default(false)
    })).min(1, 'At least one response is required')
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validatedData = surveyAnswerSchema.parse(body);

        // Validate team token and get team ID
        const team = await prisma.team.findUnique({
            where: { token: validatedData.teamToken },
            select: { id: true, name: true }
        });

        if (!team) {
            return NextResponse.json(
                { error: 'Invalid team token' },
                { status: 401 }
            );
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
            return NextResponse.json(
                { error: 'Survey not found or not published' },
                { status: 404 }
            );
        }

        // Validate question IDs exist in the survey
        const surveyQuestionIds = survey.questions.map(q => q.id);
        const responseQuestionIds = validatedData.responses.map(r => r.questionId);

        const invalidQuestionIds = responseQuestionIds.filter(
            questionId => !surveyQuestionIds.includes(questionId)
        );

        if (invalidQuestionIds.length > 0) {
            return NextResponse.json(
                { error: `Invalid question IDs: ${invalidQuestionIds.join(', ')}` },
                { status: 400 }
            );
        }

        // Check for required questions that weren't answered
        const requiredQuestions = survey.questions.filter(q => q.required);
        const answeredQuestionIds = new Set(responseQuestionIds);
        const missingRequiredQuestions = requiredQuestions.filter(
            q => !answeredQuestionIds.has(q.id)
        );

        if (missingRequiredQuestions.length > 0) {
            return NextResponse.json(
                {
                    error: `Missing required questions: ${missingRequiredQuestions.map(q => q.id).join(', ')}`
                },
                { status: 400 }
            );
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
                    submittedAt: new Date()
                }
            });

            // Create question responses
            const questionResponses = [];
            for (const response of validatedData.responses) {
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

            // Update team response count
            await tx.team.update({
                where: { id: team.id },
                data: {
                    totalResponses: { increment: 1 }
                }
            });

            return { surveyResponse, questionResponses };
        });

        return NextResponse.json({
            success: true,
            message: 'Survey response submitted successfully',
            data: {
                responseId: result.surveyResponse.id,
                surveyId: validatedData.surveyId,
                teamName: team.name,
                submittedAt: result.surveyResponse.submittedAt
            }
        });

    } catch (error) {
        console.error('Error submitting survey response:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
