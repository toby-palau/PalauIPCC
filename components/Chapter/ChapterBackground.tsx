"use client"

import { PageTypes } from "@root/@types/shared.types";
import { useQuestionFlow } from "@root/context/QuestionFlowContext"

export const ChapterBackground = () => {
    const {currentIndex, currentPage, navigate} = useQuestionFlow();
    if (!currentPage) return null;

    return (
        <div 
            id="background" 
            className="fixed h-screen w-screen"
            onClick={typeof(currentIndex) === "number" ? () => navigate(currentIndex, currentIndex, "forward", false) : undefined}
        >
            <img 
                src={`/images/backgrounds/${currentPage.backgroundImage}`}
                alt="background image"
                className="absolute h-full w-full object-cover brightness-50"
            />
            { currentPage.pageType !== PageTypes.question && (
                <div className="absolute flex flex-row items-end md:bottom-10 md:right-10 bottom-12 right-5 pointer-events-none">
                    <p className="text-white text-right md:text-base text-sm md:w-48 w-32">{"click anywhere to go to the next page!"}</p>
                    <img
                        src={"/images/misc/finger.gif"}
                        alt="click to continue"
                        className="h-8 w-8 md:h-16 md:w-16"
                    />
                </div>
            ) }
        </div>
    )
}