"use client"

import { EMAILQuestionType } from "@root/@types/shared.types";
import { subscribeToMailList } from "@root/services/BackendService";
import { dmsans } from "@root/styles/fonts";
import { useEffect, useState } from "react";

export const EmailQuestion = (props: {question: EMAILQuestionType; submitResponse: (s: string) => void; skipQuestion: () => void}) => {
    const { question, submitResponse, skipQuestion } = props;
    const [value, setValue] = useState<string>(question.userAnswer || "");
    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (!question.correctAnswer) return setDisabled(false);
        const regex = new RegExp(question.correctAnswer, "i");
        if (value.match(regex)) return setDisabled(false);
        setDisabled(true);
    }, [value])

    const onSubmit = async () => {
        if (!disabled) {
            await subscribeToMailList(value);
            submitResponse(value);
        }
    }

    return (
        <div className="max-w-md m-auto flex flex-col items-center justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <img src={"/images/misc/PalauLogo.png"} alt="Palau Logo" className="w-24 py-4" />
            <h1 className={`${dmsans.className} sm:text-4xl text-3xl mt-6 mb-2 text-white text-center font-bold`}>{props.question.questionTitle}</h1>
            <p className={`${dmsans.className} text-white text-center mt-2 mb-6`}>{props.question.questionText}</p>
            <input type="email" onChange={e => setValue(e.target.value)} value={value} className={`${dmsans.className} w-full md:w-96 w-48 bg-transparent text-white border border-white rounded-md px-2 py-4`} autoFocus />
            <button disabled={disabled} className={`${dmsans.className} w-full mt-2 p-4 rounded-md ${disabled ? "bg-blue-dark text-white-dark" : "bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100"}`} onClick={onSubmit}>{"Submit"}</button>
            { question.skippable && <button className={`${dmsans.className} w-full mt-2 p-4 underline text-white`} onClick={skipQuestion}>{"Skip"}</button> }
        </div>
    )
}