"use client"

import { staatliches } from "@root/styles/fonts"

export const Title = (props: {title: string, subtitle?: string}) => {
    return (
        <div className="absolute flex flex-col justify-center items-center h-full w-full pointer-events-none p-2">
            <h1 className={`${staatliches.className} md:text-6xl text-4xl text-white text-center`}>{props.title}</h1>
            { props.subtitle && (
                <h2 className={`md:text-2xl text-xl text-white text-center`}>{props.subtitle}</h2>
            ) }
        </div>
    )
}