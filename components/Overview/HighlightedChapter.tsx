"use client"

import { ChapterInfoType } from "@root/@types/shared.types"
import { dmsans, staatliches } from "@root/styles/fonts"
import { track } from "@vercel/analytics"

export const HighlightedChapter = ({chapter}: {chapter: ChapterInfoType}) => {
    return (
        <div id="header" className="relative w-full overflow-hidden">
            <img src={`/images/backgrounds/${chapter.chapterCoverImage}`} className="absolute inset-0 h-full w-full object-cover" />
            <div className="relative w-full bg-black bg-opacity-20">
                <div className="h-full w-full text-white md:py-5 md:px-0 p-5 md:bg-gradient-to-r bg-gradient-to-t from-black to-transparent ">
                    <h1 className={`${staatliches.className} md:text-6xl text-3xl`}>{chapter.chapterTitle}</h1>
                    <p className={`${dmsans.className} md:max-w-sm md:text-base text-sm`}>{chapter.chapterDescription}</p>
                    <div className="flex flex-row items-center">
                        <img src="/images/misc/clock.svg" />
                        <p className={`${dmsans.className} ml-1 font-bold`}>Duration: 5 min</p>
                    </div>
                    <a 
                        href={`/chapters/${chapter.cid}`} className={`${dmsans.className} flex mt-2 p-4 md:w-96 rounded-md bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100`}
                        onClick={() => track("Click Highlighted Chapter", {chapterId: chapter.cid, chapterTitle: chapter.chapterTitle})}
                    >{"Start now!"}</a>
                </div>
            </div>
        </div>
    )
}