"use client"

import { deleteUserResponses } from "@root/services/DatabaseService";
import { useRouter } from "next/navigation";

export const ResetProgress = ({userId}: {userId: string}) => {
    const router = useRouter();

    const handleResetClick = () => {
        deleteUserResponses(userId);
        router.refresh();
    }

    return (
        <button 
            className={`w-full text-center mt-4 text-red text-sm hover:underline active:scale-95 transition-all duration-100`}
            onClick={handleResetClick}
        >
            Reset my progress
        </button>
    )
}