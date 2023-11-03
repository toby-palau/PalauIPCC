"use client"

import { MCSAQuestionType } from "@root/types/shared.types";
import { dmsans } from "@root/styles/fonts";

export const MultipleChoiceQuestion = (props: {question: MCSAQuestionType, submitResponse: (s: Array<number>) => void}) => {
    const correctIds = props.question.correctAnswer ?? [];
    const selectedIds = props.question.userAnswer ?? [];
    return (
        <div className="max-w-xl m-auto flex-col items-center justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <h1 className={`${dmsans.className} sm:text-xl text-md my-4 text-white`}>{props.question.questionText}</h1>
            <div className="flex flex-col items-center justify-between">
                {props.question.options.map(o => {
                    let className = `${dmsans.className} w-full cursor-pointer sm:text-xl text-md text-center text-black rounded-md my-0.5 p-3 active:scale-95 transition-all duration-100`;
                    if (selectedIds.length > 0 && correctIds.length > 0) {
                        if (correctIds.includes(o.oid)) className += " bg-green hover:bg-green-dark text-white";
                        else if (selectedIds.includes(o.oid) && !correctIds.includes(o.oid)) className += " bg-red hover:bg-red-dark text-white animate-wiggle";
                        else className += " bg-white hover:bg-white-dark text-black";
                    } else {
                        className += " bg-white hover:bg-white-dark text-black";
                    }
                    return (
                        <button 
                            key={`option-${o.oid}`} 
                            className={`${className}`} 
                            onClick={() => props.submitResponse([o.oid])}
                        >
                        {o.optionText}
                    </button>
                    )
                })}
            </div>
        </div>
    )
}