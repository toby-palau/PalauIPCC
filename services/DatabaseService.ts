"use server"

import { Prisma, PrismaClient, Response, User } from "@prisma/client";

const prisma = new PrismaClient();

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

export const createNewResponse: (userId: string, questionId: string, questionType: string, userAnswer: string | string[] | null) => Promise<Response | undefined> = async (userId, questionId, questionType, userAnswer) => {
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

export const deleteAllResponses: (userId: string) => Promise<void> = async (userId) => {
    try {
        const deleteResult = await prisma.response.deleteMany({where: {userId}});
        console.log({deleteResult});
    } catch (error) {
        console.log(error);
    }
}