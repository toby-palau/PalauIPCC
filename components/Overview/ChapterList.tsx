"use client";

import { FilterTypeLabels, FilterTypes } from "@root/@types/shared.types";
import { ReactNode, useEffect, useState } from "react";

export const ChapterList = ({ chapters, withFilters }: {chapters: {tags: FilterTypes[]; component: ReactNode}[], withFilters: boolean}) => {
    const [filters, setFilters] = useState<{filterId: FilterTypes, filterName: string, selected: boolean}[]>([]);

    useEffect(() => {
        setFilters(Object.values(FilterTypes).map(f => ({
            filterId: f,
            filterName: FilterTypeLabels[f], 
            selected: f === "all" ? true : false,
        })));
    }, []);

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
        <div className="flex md:flex-row flex-col py-5 md:px-0 px-5 mt-4">
            { withFilters && (
                <div id="filters" className="flex md:flex-col flex-row flex-wrap md:w-48 md:mr-6">
                    { filters.map(f => (
                        <div 
                            key={`filter-${f.filterId}`} 
                            className={`flex border ${f.selected ? "border-blue hover:border-blue-dark" : "border-white hover:border-white-dark"} text-white hover:text-white-dark min-w-max rounded-full m-1 py-2 px-4 items-center text-sm cursor-pointer active:scale-95 transition-all duration-100`}
                            onClick={() => selectFilter(f.filterId)}
                        >
                            <p>{f.filterName}</p>
                        </div>
                    )) }
                </div>
            ) }
            <div id="chapters" className="flex-1 grid lg:grid-cols-3 md:grid-cols-2 grid-cols1 gap-4 md:mt-0 mt-5">
                { chapters
                    .filter(c => filters.filter(f => f.selected && c.tags.includes(f.filterId)).length > 0)
                    .map(c => c.component) }
            </div>
        </div>
    )
}