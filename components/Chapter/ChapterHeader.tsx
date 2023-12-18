"use client"

import { QuizIdType } from "@root/@types/shared.types";
import { useQuestionFlow } from "@root/contexts/QuestionFlowContext";
import { useRouter } from "next/navigation";

export const ChapterHeader = ({quizId}: {quizId: QuizIdType}) => {
    const router = useRouter();
    const {chapterId, currentIndex, progress, navigate} = useQuestionFlow();
    const hide = typeof(currentIndex) !== "number" || currentIndex <= 0;
    
    return (
        <div id="header" className="fixed w-full flex flex-col items-start z-10">
            <div id="progress-bar" className="h-2 w-full bg-white opacity-80">
                <div className="h-full bg-blue" style={{width: `${progress}%`}}/>
            </div>
            <div className="flex flex-row w-full justify-between">
                <div 
                    id="back-button"
                    className="flex flex-col m-2 items-center cursor-pointer active:scale-95 active:opacity-80"
                    onClick={!hide ? () => navigate(currentIndex, currentIndex, "backward", false) : undefined}	
                >
                    <img
                        src={`/images/misc/arrow-left-bold.svg`}
                        alt="back"
                        className={`md:h-12 md:w-12 h-8 w-8 pointer-events-none ${hide && "hidden"}`}
                    />
                    <p className={`text-white md:text-base text-sm ${hide && "hidden"}`}>{"BACK"}</p>
                </div>
                <div 
                    id="home-button"
                    className="flex flex-col m-2 items-center cursor-pointer active:scale-95 active:opacity-80"
                    onClick={() => router.push(`/${quizId}`)}
                >
                    <img 
                        src="/images/misc/home.svg"
                        alt="home"
                        className="md:h-12 md:w-12 h-8 w-8 w-8 pointer-events-none"
                    />
                    <p className={`text-white md:text-base text-sm`}>{"HOME"}</p>
                </div>
            </div>
        </div>
    )
}