"use client"

import { QuizIdType } from "@root/@types/shared.types";
import { setUserIdCookie } from "@root/services/AuthService";
import { ReactNode, createContext, useContext, useEffect } from "react";

const AuthContext = createContext<{userId: string}>({userId: ""})

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, quizId, userId }: { children: ReactNode; quizId: QuizIdType; userId: string }) => {
    useEffect(() => {
        (async () => {
            setUserIdCookie(quizId, userId);
            fetch("/api/auth", {method: "POST", body: JSON.stringify({userId})});
        })();
    }, []);

    return (
        <AuthContext.Provider value={{userId}}>
            {children}
        </AuthContext.Provider>
    )
}