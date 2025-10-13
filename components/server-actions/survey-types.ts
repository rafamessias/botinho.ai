"use server"

import { revalidatePath } from "next/cache"
import { getPrismaWrapper } from "@/lib/prisma-wrapper"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"

// Validation schemas
const createSurveyTypeSchema = z.object({
    name: z.string().min(1, "Survey type name is required"),
    isDefault: z.boolean().default(false)
})

const updateSurveyTypeSchema = createSurveyTypeSchema.extend({
    id: z.string()
})

// Create a new survey type
export const createSurveyType = async (formData: FormData) => {
    try {
        const wrapper = getPrismaWrapper()

        const rawData = {
            name: formData.get("name") as string,
            isDefault: formData.get("isDefault") === "true"
        }

        const validatedData = createSurveyTypeSchema.parse(rawData)

        // If this is set as default, unset other defaults
        if (validatedData.isDefault) {
            await wrapper.updateMany(prisma.surveyType, {
                where: {
                    isDefault: true
                },
                data: { isDefault: false }
            })
        }

        const surveyType = await wrapper.upsert(prisma.surveyType, {
            data: {
                ...validatedData,
            }
        })

        revalidatePath("/survey")
        return { success: true, surveyType }
    } catch (error) {
        console.error("Error creating survey type:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create survey type"
        }
    }
}

// Get all survey types for the current team
export const getSurveyTypes = async () => {
    try {
        const wrapper = getPrismaWrapper()

        const surveyTypes = await wrapper.findMany(prisma.surveyType, {
            orderBy: [
                { isDefault: 'desc' },
                { name: 'asc' }
            ]
        })

        return { success: true, surveyTypes }
    } catch (error) {
        console.error("Error fetching survey types:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch survey types"
        }
    }
}

// Get a single survey type by ID
export const getSurveyType = async (id: string) => {
    try {
        const wrapper = getPrismaWrapper()

        const surveyType = await wrapper.findUnique(prisma.surveyType, {
            where: { id }
        })

        if (!surveyType) {
            return { success: false, error: "Survey type not found" }
        }

        return { success: true, surveyType }
    } catch (error) {
        console.error("Error fetching survey type:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch survey type"
        }
    }
}

// Update a survey type
export const updateSurveyType = async (formData: FormData) => {
    try {
        const wrapper = getPrismaWrapper()

        const rawData = {
            id: formData.get("id") as string,
            name: formData.get("name") as string,
            isDefault: formData.get("isDefault") === "true"
        }

        const validatedData = updateSurveyTypeSchema.parse(rawData)

        // If this is set as default, unset other defaults
        if (validatedData.isDefault) {
            await wrapper.updateMany(prisma.surveyType, {
                where: {
                    isDefault: true,
                    id: { not: validatedData.id }
                },
                data: { isDefault: false }
            })
        }

        const surveyType = await wrapper.update(prisma.surveyType, {
            where: { id: validatedData.id },
            data: {
                name: validatedData.name,
                isDefault: validatedData.isDefault
            }
        })

        revalidatePath("/survey")
        return { success: true, surveyType }
    } catch (error) {
        console.error("Error updating survey type:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update survey type"
        }
    }
}

// Delete a survey type
export const deleteSurveyType = async (id: string) => {
    try {
        const wrapper = getPrismaWrapper()

        // Check if any surveys are using this type
        const surveysUsingType = await wrapper.count(prisma.survey, {
            where: { typeId: id }
        })

        if (surveysUsingType > 0) {
            return {
                success: false,
                error: `Cannot delete survey type. ${surveysUsingType} survey(s) are using this type.`
            }
        }

        await wrapper.delete(prisma.surveyType, { where: { id } })

        revalidatePath("/survey")
        return { success: true }
    } catch (error) {
        console.error("Error deleting survey type:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete survey type"
        }
    }
}

// Set default survey type
export const setDefaultSurveyType = async (id: string) => {
    try {
        const wrapper = getPrismaWrapper()

        // Unset current default
        await wrapper.updateMany(prisma.surveyType, {
            where: {
                isDefault: true
            },
            data: { isDefault: false }
        })

        // Set new default
        await wrapper.update(prisma.surveyType, {
            where: { id },
            data: { isDefault: true }
        })

        revalidatePath("/survey")
        return { success: true }
    } catch (error) {
        console.error("Error setting default survey type:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to set default survey type"
        }
    }
}
