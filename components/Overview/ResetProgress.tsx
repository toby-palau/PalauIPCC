"use client"

import { QuizIdType } from "@root/@types/shared.types";
import { deleteUserResponses } from "@root/services/DatabaseService";
import { useRouter } from "next/navigation";

export const ResetProgress = ({userId, quizId}: {userId: string, quizId: QuizIdType}) => {
    const router = useRouter();

    const handleResetClick = () => {
        deleteUserResponses(quizId, userId);
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