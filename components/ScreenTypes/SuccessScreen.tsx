"use client"

import { SuccessScreenType } from "@root/types/shared.types";
import { rocksalt, staatliches } from "@root/styles/fonts";

type SuccessProps = {
    title: string;
    subtitle: string;
    avatarImage: string;
}

export const SuccessScreen = ({title, subtitle, avatarImage}: SuccessProps) => {
    return(
        <div className="relative flex-col w-screen min-h-full flex justify-center items-center">
            <h1 className={`${staatliches.className} md:text-6xl text-4xl text-white`}>{title}</h1>
            <h2 className={`${rocksalt.className} md:text-6xl text-4xl text-green -rotate-6`}>{subtitle}</h2>
            <img 
                src={`/images/avatars/${avatarImage}`}
                alt="avatar" 
                className={`w-4/12`}
            />
        </div>
    )
}