"use server";

import { ChapterInfoType } from "@root/@types/shared.types"
import { dmsans } from "@root/styles/fonts"

export const ChapterCard = ({chapter, progress}: {chapter: ChapterInfoType; progress: number}) => {
    return (
        <a key={`chapter-${chapter.cid}`} href={`/chapters/${chapter.cid}`} className="rounded-md cursor-pointer justify-center">
            <div className="relative md:h-48 h-36 w-full mb-2 rounded-md object-cover hover:border-2 hover:border-blue overflow-hidden">
                <img src={`/images/backgrounds/thumbnail_${chapter.chapterCoverImage}`} className="absolute h-full w-full object-cover"/>
                { progress > 0 && <div className="absolute h-full w-full flex justify-center items-center text-white opacity-80">{`${progress*100}%`}</div> }
            </div>
            <p className={`${dmsans.className} text-1xl text-white text-left`}>{chapter.chapterTitle}</p>
        </a>
    )
}