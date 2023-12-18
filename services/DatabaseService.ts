"use server"

import { Prisma, PrismaClient, Response, User } from "@prisma/client";
import { QuestionStatsType, QuizIdType } from "@root/@types/shared.types";
import { IsoCountryCode2 } from "@root/@types/countryCodeLookup";

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

export const getUser: (userId: string) => Promise<User | undefined> = async (userId) => {
    try {
        const user = await prisma.user.findUnique({where: {userId}});
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        console.log(error);
    }
}

export const getUserCount: () => Promise<number | undefined> = async () => {
    try {
        const userCount = await prisma.user.count();
        return userCount;
    } catch (error) {
        console.log(error);
    }
}

export const getResponseCountsByDate: (quizId: QuizIdType) => Promise<{date: Date; count: number}[] | undefined> = async (quizId) => {
    try {
        const responseCountsByDate: {date: Date; count: number}[] = await prisma.$queryRaw`
            SELECT DATE("createdAt") AS date, CAST(COUNT(*) AS INT) AS count
            FROM "Response"
            WHERE "archived" = false AND "createdAt" > CURRENT_DATE - INTERVAL '7 DAYS' AND "quizId" = ${quizId}
            GROUP BY date
            ORDER BY date ASC;
        `;
        const currentDate = new Date();
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setUTCHours(0,0,0,0);
        while (startDate < currentDate) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            endDate.setUTCHours(0,0,0,0);
            const dateExists = responseCountsByDate.find(c => c.date >= startDate && c.date < endDate);
            if (!dateExists) responseCountsByDate.push({date: new Date(startDate), count: 0});
            startDate = new Date(endDate)
        }
        return responseCountsByDate.sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
        console.log(error);
    }
}

export const getUserCountByCountry: (quizId: QuizIdType) => Promise<{country: IsoCountryCode2; count: number}[] | undefined> = async (quizId) => {
    try {
        const userCountByCountry: {country: IsoCountryCode2; count: number}[] = await prisma.$queryRaw`
            SELECT country, CAST(COUNT(*) AS INT) AS count 
            FROM "User" 
            WHERE country IS NOT NULL
            GROUP BY country 
            ORDER BY count DESC;
        `;
        return userCountByCountry;
    } catch (error) {
        console.log(error);
    
    }
}

export const updateUserCountry: (userId: string, country: string, countryRegion?: string, city?: string) => Promise<User | undefined> = async (userId, country, countryRegion, city) => {
    try {
        const updatedUser = await prisma.user.update({where: {userId}, data: {country, countryRegion, city}});
        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

export const getResponses: (quizId: QuizIdType, userId: string) => Promise<Response[] | undefined> = async (quizId, userId) => {
    try {
        const responses = await prisma.response.findMany({
            where: {quizId, userId, archived: false}, 
            orderBy: {updatedAt: 'desc'}
        });
        return responses;
    } catch (error) {
        console.log(error);
    }
}

export const createNewResponse: (quizId: QuizIdType, userId: string, questionId: string, questionType: string, userAnswer: string | string[] | null, answeredCorrectly?: boolean) => Promise<Response | undefined> = async (quizId, userId, questionId, questionType, userAnswer, answeredCorrectly) => {
    try {
        prisma.response.updateMany({
            where: {quizId, userId, questionId},
            data: {archived: true},
        });
        const newResponse = await prisma.response.create({
            data: {
                userId, 
                quizId,
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

export const resetExistingResponse: (quizId: QuizIdType, userId: string, questionId: string) => void = (quizId, userId, questionId) => {
    try {
        prisma.response.updateMany({
            where: {quizId, userId, questionId},
            data: {archived: true},
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteUserResponses: (quizID: QuizIdType, userId: string) => Promise<void> = async (quizId, userId) => {
    try {
        await prisma.response.deleteMany({where: {quizId, userId}});
    } catch (error) {
        console.log(error);
    }
}

export const getAllQuestionStats: (quizId: QuizIdType) => Promise<QuestionStatsType[] | undefined> = async (quizId) => {
    try {
        const responses = await prisma.$queryRaw`
            SELECT 
                "questionId", 
                CAST(COUNT(*) AS INT) AS response_count, 
                CAST(SUM(CASE WHEN "answeredCorrectly" = true THEN 1 ELSE 0 END) AS INT) AS true_count,
                CAST(SUM(CASE WHEN "answeredCorrectly" = false THEN 1 ELSE 0 END) AS INT) AS false_count,
                CAST(SUM(CASE WHEN "answeredCorrectly" = true THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) AS ratio
            FROM "Response"
            WHERE "archived" = false AND "quizId" = ${quizId}
            GROUP BY "questionId"
            ORDER BY "response_count" DESC;
        `;
        return responses as QuestionStatsType[];
    } catch (error) {
        console.log(error);
    }
}