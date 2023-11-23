"use client"

import { setUserIdCookie } from "@root/services/AuthService";
import { ReactNode, createContext, useContext, useEffect } from "react";

const AuthContext = createContext<{userId: string}>({userId: ""})

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
    useEffect(() => {
        (async () => {
            await setUserIdCookie(userId);
            fetch("/api/auth");
        })();
    }, []);

    return (
        <AuthContext.Provider value={{userId}}>
            {children}
        </AuthContext.Provider>
    )
}