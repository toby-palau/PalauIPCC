"use client"

import { dmsans, staatliches } from "@root/styles/fonts"

export const Title = (props: {title: string, subtitle?: string}) => {
    return (
        <div className="absolute flex flex-col justify-center items-center h-full w-full pointer-events-none">
            <h1 className={`${staatliches.className} text-6xl text-white`}>{props.title}</h1>
            { props.subtitle && (
                <h2 className={`${dmsans.className} text-2xl text-white`}>{props.subtitle}</h2>
            ) }
        </div>
    )
}