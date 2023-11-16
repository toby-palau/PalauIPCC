"use client"

import { deleteAllResponses } from "@root/services/DatabaseService"
import { dmsans } from "@root/styles/fonts"

export const ResetProgress = ({userId}: {userId: string}) => {
    return (
        <button 
            className={`${dmsans.className} w-full text-center mt-4 text-red text-sm hover:underline active:scale-95 transition-all duration-100`}
            onClick={() => deleteAllResponses(userId)}
        >
            Reset my progress
        </button>
    )
}