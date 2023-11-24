"use client";

import { ChapterInfoType } from "@root/@types/shared.types"
import { staatliches } from "@root/styles/fonts"
import { track } from "@vercel/analytics";

const yellowFilter = {filter: "invert(12%) sepia(78%) saturate(3774%) hue-rotate(309deg) brightness(98%) contrast(88%)"};

export const ChapterCard = ({chapter, progress, score}: {chapter: ChapterInfoType; progress: number; score: number}) => {
    return (
        <a 
            key={`chapter-${chapter.cid}`} 
            href={`/chapters/${chapter.cid}`} 
            className="rounded-md cursor-pointer justify-center"
            onClick={() => track("Click Chapter Card", {chapterId: chapter.cid, chapterTitle: chapter.chapterTitle})}
        >
            <div className="relative md:h-48 h-36 w-full mb-2 rounded-md object-cover hover:border-2 hover:border-blue overflow-hidden">
                <img src={`/images/backgrounds/thumbnail_${chapter.chapterCoverImage}`} className="absolute h-full w-full object-cover"/>
                {progress > 0 && (
                    <>
                        <div className="absolute h-full bg-green bg-opacity-50" style={{width: `${progress*100}%`}}/>
                        { progress < 1 && <div className={`${staatliches.className} absolute h-full w-full flex justify-center items-center text-white text-4xl`}>{`${Math.round(progress*100)}%`}</div> }
                    </>
                ) }
                { (progress >= 1 && typeof(score) === "number") && (
                    <div className="absolute h-full w-full flex justify-center items-center">
                        {
                            [1,2,3,4,5].map(i => (
                                <img 
                                    src="/images/misc/star.svg" 
                                    alt="star" 
                                    key={`star-${i}`} 
                                    className={"w-1/12"} 
                                    style={score >= i / 5 ? yellowFilter : {}}
                                />
                            ))
                        }
                    </div> 
                ) }
            </div>
            <p className={`text-1xl text-white text-left`}>{chapter.chapterTitle}</p>
        </a>
    )
}