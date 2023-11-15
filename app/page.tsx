"use server"

import { dmsans, staatliches } from "@root/styles/fonts";
import Link from "next/link";
import { ChapterList } from "@root/components/Overview/ChapterList";
import { listAllChapters } from "./actions";
import { ChapterCard } from "@root/components/Overview/ChapterCard";
import { Disclaimer } from "@root/components/Overview/Disclaimer";


const Page = async ({searchParams: {previousChapter}}: {searchParams: {previousChapter?: string}}) => {
    const chapters = await listAllChapters();
    if (chapters.length <= 0) return null;

    let highlightedChapterIndex = 0;
    const previousChapterIndex = chapters.findIndex(c => c.cid === previousChapter);
    if (previousChapterIndex >= 0 && previousChapterIndex < chapters.length - 1) highlightedChapterIndex = previousChapterIndex + 1;

    const chapterList = chapters.map(c => ({
        tags: c.tags,
        component: <ChapterCard chapter={c} />
    }));

    return (
        <div className="bg-black min-h-screen md:p-16 p-0">
            { chapters[highlightedChapterIndex] && 
                <div id="header" className="relative w-full overflow-hidden">
                    <img src={`/images/backgrounds/${chapters[highlightedChapterIndex].chapterCoverImage}`} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="relative w-full bg-black bg-opacity-20">
                        <div className="h-full w-full text-white md:py-5 md:px-0 p-5 md:bg-gradient-to-r bg-gradient-to-t from-black to-transparent ">
                            <h1 className={`${staatliches.className} md:text-6xl text-3xl`}>{chapters[highlightedChapterIndex].chapterTitle}</h1>
                            <p className={`${dmsans.className} md:max-w-sm md:text-base text-sm`}>{chapters[highlightedChapterIndex].chapterDescription}</p>
                            <div className="flex flex-row items-center">
                                <img src="/images/misc/clock.svg" />
                                <p className={`${dmsans.className} ml-1 font-bold`}>Duration: 5 min</p>
                            </div>
                            <Link href={`/chapters/${chapters[highlightedChapterIndex].cid}`} className={`${dmsans.className} flex mt-2 p-4 md:w-96 rounded-md bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100`}>{"Start now!"}</Link>
                        </div>
                    </div>
                </div>
            }
            <ChapterList chapters={chapterList} />
            <Disclaimer />
        </div>
    )
}

export default Page;