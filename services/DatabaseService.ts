"use server"

import { Prisma, PrismaClient, Response, User } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") prisma = new PrismaClient();
else {
    if (!(global as any).prisma) (global as any).prisma = new PrismaClient();
    prisma = (global as any).prisma;
}

export const createNewUser: () => Promise<User | undefined> = async () => {
    try {
        const newUser = await prisma.user.create({data: {}});
        return newUser;
    } catch (error) {
        console.log(error)
    }
}

export const getResponses: (userId: string) => Promise<Response[] | undefined> = async (userId) => {
    try {
        const responses = await prisma.response.findMany({
            where: {userId, archived: false}, 
            orderBy: {updatedAt: 'desc'}
        });
        return responses;
    } catch (error) {
        console.log(error);
    }
}

export const createNewResponse: (userId: string, questionId: string, questionType: string, userAnswer: string | string[] | null, answeredCorrectly?: boolean) => Promise<Response | undefined> = async (userId, questionId, questionType, userAnswer, answeredCorrectly) => {
    try {
        prisma.response.updateMany({
            where: {userId, questionId},
            data: {archived: true},
        });
        const newResponse = await prisma.response.create({
            data: {
                userId, 
                questionId, 
                questionType, 
                userAnswer: userAnswer ?? Prisma.JsonNull,
                answeredCorrectly,
                archived: false
            }
        });
        return newResponse;
    } catch (error) {
        console.log(error);
    }
}

export const resetExistingResponse: (userId: string, questionId: string) => void = (userId, questionId) => {
    try {
        prisma.response.updateMany({
            where: {userId, questionId},
            data: {archived: true},
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteUserResponses: (userId: string) => Promise<void> = async (userId) => {
    try {
        const deleteResult = await prisma.response.deleteMany({where: {userId}});
        console.log({deleteResult});
    } catch (error) {
        console.log(error);
    }
}


type QuestionStatsType = {questionId: string; response_count: number; true_count: number; false_count: number; ratio: number};
export const getAllQuestionStats: () => Promise<QuestionStatsType[] | undefined> = async () => {
    try {
        const responses = await prisma.$queryRaw`
            SELECT 
                "questionId", 
                CAST(COUNT(*) AS INT) AS response_count, 
                CAST(SUM(CASE WHEN "answeredCorrectly" = true THEN 1 ELSE 0 END) AS INT) AS true_count,
                CAST(SUM(CASE WHEN "answeredCorrectly" = false THEN 1 ELSE 0 END) AS INT) AS false_count,
                CAST(SUM(CASE WHEN "answeredCorrectly" = true THEN 1 ELSE 0 END) AS NUMERIC) / CAST(COUNT(*) AS NUMERIC) AS ratio
            FROM "Response"
            WHERE archived = false
            GROUP BY "questionId"
            ORDER BY response_count DESC;
        `;
        return responses as QuestionStatsType[];
    } catch (error) {
        console.log(error);
    }
}