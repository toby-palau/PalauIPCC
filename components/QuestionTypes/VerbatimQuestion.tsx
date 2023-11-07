"use client"

import { VERBQuestionType } from "@root/@types/shared.types";
import { dmsans } from "@root/styles/fonts";
import { useState } from "react";

export const VerbatimQuestion = (props: {question: VERBQuestionType, submitResponse: (s: string) => void}) => {
    const { question, submitResponse } = props;
    const [value, setValue] = useState<string>(question.userAnswer || "");
    return (
        <div className="max-w-xl m-auto flex flex-col justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <h1 className={`${dmsans.className} sm:text-xl text-md my-4 text-white`}>{props.question.questionText}</h1>
            <input onChange={e => setValue(e.target.value)} value={value} className={`${dmsans.className} md:w-96 w-48 bg-transparent text-white border border-white rounded-md px-2 py-4`} autoFocus />
            <button className={`${dmsans.className} mt-2 p-4 rounded-md bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100`} onClick={() => submitResponse(value)}>{"Submit"}</button>
        </div>
    )
}