"use client"

import { dmsans, staatliches } from "@root/styles/fonts";
import { ChapterType, FilterTypeLabels, FilterTypes } from "@root/@types/shared.types";
import Link from "next/link";
import { useEffect, useState } from "react";


const Page = () => {
    const [filters, setFilters] = useState<Array<{filterName: string; filterId: FilterTypes; selected: boolean}>>([]);
    const [chapters, setChapters] = useState<Array<ChapterType>>([]);

    useEffect(() => {
        fetchChapters();
        constructFilters();
    }, []);

    const fetchChapters = async () => {
        const response = await fetch("/api/chapters");
        const {data: chapters} = await response.json();
        setChapters(chapters);
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
            { chapters[0] && 
                <div id="header" className="relative w-full overflow-hidden">
                    <img src={`/images/backgrounds/${chapters[0].chapterCoverImage}`} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="relative w-full bg-black bg-opacity-20">
                        <div className="h-full w-full text-white md:py-5 md:px-0 p-5 md:bg-gradient-to-r bg-gradient-to-t from-black to-transparent ">
                            <h1 className={`${staatliches.className} md:text-6xl text-3xl`}>{chapters[0].chapterTitle}</h1>
                            <p className={`${dmsans.className} md:max-w-sm md:text-base text-sm`}>{chapters[0].chapterDescription}</p>
                            <div className="flex flex-row items-center">
                                <img src="/images/misc/clock.svg" />
                                <p className={`${dmsans.className} ml-1 font-bold`}>Duration: 5 min</p>
                            </div>
                            <Link href={`/chapters/${chapters[0].cid}`} className={`${dmsans.className} flex mt-2 p-4 md:w-96 rounded-md bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100`}>{"Start now!"}</Link>
                        </div>
                    </div>
                </div>
            }
            <div className="flex md:flex-row flex-col py-5 md:px-0 px-5">
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
                <div id="chapters" className="flex-1 grid lg:grid-cols-3 md:grid-cols-2 grid-cols1 gap-2 md:mt-0 mt-5">
                    { chapters
                        .filter(c => filters.filter(f => f.selected && c.tags.includes(f.filterId)).length > 0)
                        .map(c => (
                            <Link key={`chapter-${c.cid}`} href={`/chapters/${c.cid}`} className="relative md:h-48 h-36 rounded-md cursor-pointer justify-center items-center overflow-hidden">
                                <img src={`/images/backgrounds/${c.chapterCoverImage}`} className="absolute inset-0 h-full w-full object-cover my-auto" />
                                <div className="relative flex h-full w-full p-3 justify-center items-center bg-black bg-opacity-50">
                                    <p className={`${staatliches.className} text-2xl text-white text-center`}>{c.chapterTitle}</p>
                                </div>
                            </Link>
                    )) }
                </div>
            </div>
        </div>
    )
}

export default Page;