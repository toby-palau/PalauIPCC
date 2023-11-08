"use client"

import { dmsans, staatliches } from "@root/styles/fonts";
import { ChapterType, FilterTypeLabels, FilterTypes } from "@root/@types/shared.types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


const Page = () => {
    const searchParams = useSearchParams();
    const [highlightedChapterIndex, setHighlightedChapterIndex] = useState<number>(0);
    const [filters, setFilters] = useState<Array<{filterName: string; filterId: FilterTypes; selected: boolean}>>([]);
    const [chapters, setChapters] = useState<Array<ChapterType>>([]);

    useEffect(() => {
        fetchChapters();
        constructFilters();
    }, []);

    const fetchChapters = async () => {
        const response = await fetch("/api/chapters");
        const {data: chapters} = await response.json() as {data: ChapterType[]};
        setChapters(chapters);
        
        const chapterId = searchParams.get("previousChapter");
        const chapterIndex = chapters.findIndex(c => c.cid === chapterId);
        if (chapterIndex >= 0 && chapterIndex < chapters.length - 1) setHighlightedChapterIndex(chapterIndex + 1);
        else setHighlightedChapterIndex(0);
    }

    const constructFilters = () => {
        const filtersObject = Object.values(FilterTypes).map(f => {
            return {
                filterId: f,
                filterName: FilterTypeLabels[f], 
                selected: f === "all" ? true : false,
            }
        });
        setFilters(filtersObject);
    }

    const selectFilter = (filterId: FilterTypes) => {
        let newFilters = filters;
        if (filterId !== FilterTypes.all) {
            newFilters = newFilters.map(f => f.filterId === FilterTypes.all ? {...f, selected: false} : f.filterId === filterId ? {...f, selected: !f.selected} : f);
        }
        if (filterId === FilterTypes.all || newFilters.filter(f => f.selected).length <= 0) {
            newFilters = newFilters.map(f => f.filterId === FilterTypes.all ? {...f, selected: true} : {...f, selected: false});
        }
        setFilters(newFilters);
    }


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
            <div className="flex md:flex-row flex-col py-5 md:px-0 px-5 mt-4">
                <div id="filters" className="flex md:flex-col flex-row flex-wrap md:w-48 md:mr-6">
                    { filters.map(f => (
                        <div 
                            key={`filter-${f.filterId}`} 
                            className={`flex border ${f.selected ? "border-blue hover:border-blue-dark" : "border-white hover:border-white-dark"} text-white hover:text-white-dark min-w-max rounded-full m-1 py-2 px-4 items-center text-sm cursor-pointer active:scale-95 transition-all duration-100`}
                            onClick={() => selectFilter(f.filterId)}
                        >
                            <p className={`${dmsans.className}`}>{f.filterName}</p>
                        </div>
                    )) }
                </div>
                <div id="chapters" className="flex-1 grid lg:grid-cols-3 md:grid-cols-2 grid-cols1 gap-4 md:mt-0 mt-5">
                    { chapters
                        .filter(c => filters.filter(f => f.selected && c.tags.includes(f.filterId)).length > 0)
                        .map((c, i) => (
                            <Link key={`chapter-${c.cid}`} href={`/chapters/${c.cid}`} className="rounded-md cursor-pointer justify-center">
                                <img src={`/images/backgrounds/${c.chapterCoverImage}`} className="md:h-48 h-36 w-full mb-2 rounded-md object-cover hover:border-2 hover:border-blue"/>
                                <p className={`${dmsans.className} text-1xl text-white text-left`}>{c.chapterTitle}</p>
                            </Link>
                    )) }
                </div>
            </div>
            <div className="flex flex-row items-end justify-end md:px-0 px-5 md:py-0 py-5">
                <img src="/images/misc/ipcc-logo.png" className="w-16 mr-2" />
                <p className={`${dmsans.className} w-72 text-xs text-white text-right`}>
                    The content for this experience was generated based on the <Link href="https://www.ipcc.ch/report/sixth-assessment-report-cycle/" className={"text-blue hover:text-blue-dark underline"} target="_blank">2023 IPCC Synthesis Report</Link>.
                </p>
            </div>
        </div>
    )
}

export default Page;