"use client"

import { EMAILQuestionType } from "@root/@types/shared.types";
import { subscribeToMailList } from "@root/services/BackendService";
import { dmsans } from "@root/styles/fonts";
import { useEffect, useState } from "react";

export const EmailQuestion = (props: {question: EMAILQuestionType, submitResponse: (s: string) => void}) => {
    const { question, submitResponse } = props;
    const [value, setValue] = useState<string>(question.userAnswer || "");
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (!question.correctAnswer) return setDisabled(false);
        const regex = new RegExp(question.correctAnswer, "i");
        if (value.match(regex)) return setDisabled(false);
        setDisabled(true);
    }, [value])

    const onSubmit = () => {
        if (!disabled) {
            subscribeToMailList(value);
            submitResponse(value);
        }
    }

    return (
        <div className="max-w-xl m-auto flex flex-col justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <h1 className={`${dmsans.className} sm:text-xl text-md my-4 text-white`}>{props.question.questionText}</h1>
            <input type="email" onChange={e => setValue(e.target.value)} value={value} className={`${dmsans.className} md:w-96 w-48 bg-transparent text-white border border-white rounded-md px-2 py-4`} autoFocus />
            <button disabled={disabled} className={`${dmsans.className} mt-2 p-4 rounded-md ${disabled ? "bg-blue-dark text-white-dark" : "bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100"}`} onClick={onSubmit}>{"Submit"}</button>
        </div>
    )
}