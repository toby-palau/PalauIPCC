"use server";

import { ChapterInfoType } from "@root/@types/shared.types"
import { dmsans } from "@root/styles/fonts"
import Link from "next/link"

export const ChapterCard = ({chapter}: {chapter: ChapterInfoType}) => {
    return (
        <Link key={`chapter-${chapter.cid}`} href={`/chapters/${chapter.cid}`} className="rounded-md cursor-pointer justify-center">
            <img src={`/images/backgrounds/thumbnail_${chapter.chapterCoverImage}`} className="md:h-48 h-36 w-full mb-2 rounded-md object-cover hover:border-2 hover:border-blue"/>
            <p className={`${dmsans.className} text-1xl text-white text-left`}>{chapter.chapterTitle}</p>
        </Link>
    )
}