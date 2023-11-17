"use server"

import { cookies } from "next/headers"
import { createNewUser } from "./DatabaseService";

export const getUserId = async () => {
    try {
        let userId = cookies().get("userId")?.value;
        if (!userId) {
            const newUser = await createNewUser();
            if (!newUser) throw new Error("Unable to create new user");
            userId = newUser.userId;
        }
        return userId;
    } catch (error) {
        console.log(error);
    }
}

export const setUserIdCookie = async (userId: string) => {
    const existingUserId = cookies().get("userId")?.value;
    if (existingUserId !== userId) cookies().set("userId", userId);
}

