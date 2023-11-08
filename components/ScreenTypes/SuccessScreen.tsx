"use client"

import { rocksalt, staatliches } from "@root/styles/fonts";
import { useQuestionFlow } from "@root/context/QuestionFlowContext";
import { useEffect } from "react";

type SuccessProps = {
    title: string;
    subtitle: string;
    avatarImage: string;
}

export const SuccessScreen = ({title, subtitle, avatarImage}: SuccessProps) => {

    const { score } = useQuestionFlow();
    const greenStars: React.JSX.Element[] = [];
    const greyStars: React.JSX.Element[] = [];
    
    useEffect(() => {
        console.log({score});
        for (let i = 0; i < score.correct; i++) {
            console.log("pushing green star", i)
            greenStars.push(
                <img
                    src={"/images/misc/star-green.svg"}
                    alt="star"
                    className="h-8 w-8 md:h-16 md:w-16"
                />
            )
        }
        for (let i = 0; i < score.total - score.correct; i++) {
            console.log("pushing grey star", i)
            greyStars.push(
                <img
                    src={"/images/misc/star-grey.svg"}
                    alt="star"
                    className="h-8 w-8 md:h-16 md:w-16"
                />
            )
        }
    }, [score])

    return(
        <div className="relative flex-col w-screen min-h-full flex justify-center items-center">
            <h1 className={`${staatliches.className} md:text-6xl text-4xl text-white`}>{title}</h1>
            <h2 className={`${rocksalt.className} md:text-6xl text-2xl text-green -rotate-6 md:-mt-6 -mt-4 mb-4`}>{subtitle}</h2>
            <img 
                src={`/images/avatars/${avatarImage}`}
                alt="avatar" 
                className={`w-4/12`}
            />
            <div className="relative flex flex-row md:-mt-12 -mt-4">
                {greenStars}
                {greyStars}
                {/* <img
                    src={"/images/misc/star-green.svg"}
                    alt="star"
                    className="h-8 w-8 md:h-16 md:w-16 md:mx-1 mx-0.5"
                />
                <img
                    src={"/images/misc/star-green.svg"}
                    alt="star"
                    className="h-8 w-8 md:h-16 md:w-16 md:mx-1 mx-0.5"
                />
                <img
                    src={"/images/misc/star-grey.svg"}
                    alt="star"
                    className="h-8 w-8 md:h-16 md:w-16 md:mx-1 mx-0.5"
                />
                <img
                    src={"/images/misc/star-grey.svg"}
                    alt="star"
                    className="h-8 w-8 md:h-16 md:w-16 md:mx-1 mx-0.5"
                /> */}
            </div>
        </div>
    )
}