"use client"

import { ChapterInfoType, QuizIdType } from "@root/@types/shared.types"
import { staatliches } from "@root/styles/fonts"
import { track } from "@vercel/analytics"

export const HighlightedChapter = ({chapter, quizId}: {chapter: ChapterInfoType; quizId: QuizIdType}) => {
    const darkMode = quizId !== "uob";
    return (
        <div id="header" className="relative w-full overflow-hidden">
            <img src={`/images/backgrounds/${chapter.chapterCoverImage}`} className="absolute inset-0 h-full w-full object-cover" />
            <div className={`relative w-full ${darkMode ? "bg-black" : "bg-white"} bg-opacity-20`}>
                <div className={`h-full w-full ${darkMode ? "text-white" : "text-black-light"} md:py-5 md:px-0 p-5 md:bg-gradient-to-r bg-gradient-to-t ${darkMode ? "from-black" : "from-white"} to-transparent `}>
                    <h1 className={`${staatliches.className} md:text-6xl text-3xl`}>{chapter.chapterTitle}</h1>
                    <p className={`md:max-w-sm md:text-base text-sm`}>{chapter.chapterDescription}</p>
                    <div className="flex flex-row items-center">
                        <img style={darkMode ? {} : {filter: "invert(100%)"}} src="/images/misc/clock.svg" />
                        <p className={`ml-1 font-bold`}>Duration: 5 min</p>
                    </div>
                    <a 
                        href={`/${quizId}/chapters/${chapter.cid}`} className={`flex mt-2 p-4 md:w-96 rounded-md ${quizId === "uob" ? "bg-uob-blue hover:bg-uob-blue-dark" : "bg-blue hover:bg-blue-dark"} text-white active:scale-95 transition-all duration-100`}
                        onClick={() => track("Click Highlighted Chapter", {chapterId: chapter.cid, chapterTitle: chapter.chapterTitle})}
                    >{"Start now!"}</a>
                </div>
            </div>
        </div>
    )
}