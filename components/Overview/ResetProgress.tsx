"use client"

import { deleteAllResponses } from "@root/services/DatabaseService"
import { dmsans } from "@root/styles/fonts"
import { useRouter } from "next/navigation"

export const ResetProgress = ({userId}: {userId: string}) => {
    const router = useRouter();

    const handleResetClick = () => {
        deleteAllResponses(userId);
        router.refresh();
    }

    return (
        <button 
            className={`${dmsans.className} w-full text-center mt-4 text-red text-sm hover:underline active:scale-95 transition-all duration-100`}
            onClick={handleResetClick}
        >
            Reset my progress
        </button>
    )
}