"use client"

import { setUserIdCookie } from "@root/services/AuthService";
import { ReactNode, createContext, useContext, useEffect } from "react";

const AuthContext = createContext<{userId: string}>({userId: ""})

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
    useEffect(() => {
        (async () => {
            await setUserIdCookie(userId);
            const response = await fetch("/api/auth", {method: "POST", body: JSON.stringify({userId})});
            const data = await response.json();
            console.log(data)
        })();
    }, []);

    return (
        <AuthContext.Provider value={{userId}}>
            {children}
        </AuthContext.Provider>
    )
}