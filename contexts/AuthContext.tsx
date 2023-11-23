"use client"

import { setUserIdCookie } from "@root/services/AuthService";
import { ReactNode, createContext, useContext, useEffect } from "react";

const AuthContext = createContext<{userId: string}>({userId: ""})

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
    useEffect(() => {
        (async () => {
            await setUserIdCookie(userId);
            const response = await fetch("/api/auth");
            const {body} = await response.json();
            console.log(body)
        })();
    }, []);

    return (
        <AuthContext.Provider value={{userId}}>
            {children}
        </AuthContext.Provider>
    )
}