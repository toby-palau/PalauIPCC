"use client"

import { useEffect, useState } from "react";
import { EMAILQuestionType, QuizIdType } from "@root/@types/shared.types";
import { subscribeToMailList } from "../../../services/MailChimpService";


export const EmailQuestion = (props: {quizId: QuizIdType; question: EMAILQuestionType; disabled: boolean; submitResponse: (s: string) => void; skipQuestion: () => void}) => {
    const { question, submitResponse, skipQuestion } = props;
    const [value, setValue] = useState<string>(question.userAnswer || "");
    const [passTest, setPassTest] = useState<boolean>(false);

    useEffect(() => {
        if (!question.correctAnswer) return setPassTest(true);
        const regex = new RegExp(question.correctAnswer, "i");
        if (value.match(regex)) return setPassTest(true);
        setPassTest(false);
    }, [value]);

    const onSubmit = async () => {
        if (passTest && !props.disabled) {
            await subscribeToMailList(props.quizId, value);
            submitResponse(value);
        }
    }

    return (
        <div className="max-w-md m-auto flex flex-col items-center justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <img src={"/images/misc/PalauLogo.png"} alt="Palau Logo" className="w-24 py-4" />
            <h1 className={`sm:text-4xl text-3xl mt-6 mb-2 text-white text-center font-bold`}>{props.question.questionTitle}</h1>
            <p className={`text-white text-center mt-2 mb-6`}>{props.question.questionText}</p>
            <input disabled={props.disabled} type="email" onChange={e => setValue(e.target.value)} value={value} className={`w-full md:w-96 w-48 bg-transparent text-white border border-white rounded-md px-2 py-4`} autoFocus />
            <button disabled={!passTest || props.disabled} className={`w-full mt-2 p-4 rounded-md ${!passTest || props.disabled ? "bg-blue-dark text-white-dark" : "bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100"}`} onClick={onSubmit}>{"Submit"}</button>
            { question.skippable && <button disabled={props.disabled} className={`w-full mt-2 p-4 underline text-white active:scale-95 transition-all duration-100`} onClick={skipQuestion}>{"Skip"}</button> }
        </div>
    )
}