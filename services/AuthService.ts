"use server"

import { cookies } from "next/headers"
import { createNewUser } from "./DatabaseService";
import { QuizIdType } from "@root/@types/shared.types";

export const getUserId = async (quizId: QuizIdType) => {
    try {
        let userId = cookies().get(`${quizId}UserId`)?.value;
        let legacyUserId = cookies().get(`userId`)?.value;

        if (!userId && !legacyUserId) {
            const newUser = await createNewUser(quizId);
            if (!newUser) throw new Error("Unable to create new user");
            userId = newUser.userId;
        }
        return userId ?? legacyUserId;
    } catch (error) {
        console.log(error);
    }
}

export const setUserIdCookie = async (quizId: QuizIdType, userId: string) => {
    const existingUserId = cookies().get(`${quizId}UserId`)?.value;
    if (existingUserId !== userId) cookies().set(`${quizId}UserId`, userId);
    cookies().delete(`userId`);
}

