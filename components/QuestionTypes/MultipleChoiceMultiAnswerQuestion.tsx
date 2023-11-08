import { MCMAQuestionType } from "@root/@types/shared.types";
import { dmsans } from "@root/styles/fonts";
import { useState } from "react";

export const MultipleChoiceMultiAnswerQuestion = (props: {question: MCMAQuestionType, submitResponse: (s: Array<number>) => void, resetResponse: () => void}) => {
    const [selectedIds, setSelectedIds] = useState<Array<number>>(props.question.userAnswer ?? []);

    const questionAnswered = Boolean(props.question.userAnswer);
    const userAnswerIds = props.question.userAnswer;

    const questionHasCorrectAnswer = Boolean(props.question.correctAnswer);
    const correctIds = props.question.correctAnswer;

    const toggleOption = (oid: number) => {
        props.resetResponse();
        if (selectedIds.includes(oid)) setSelectedIds(selectedIds.filter(id => id !== oid));
        else setSelectedIds([...selectedIds, oid]);
    }

    return (
        <div className="max-w-xl m-auto flex-col items-center justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <h1 className={`${dmsans.className} sm:text-xl text-md my-4 text-white`}>{props.question.questionText}</h1>
            <div className="flex flex-col items-center justify-between">
                { props.question.options.map(o => {
                    const selected = selectedIds.includes(o.oid) || userAnswerIds?.includes(o.oid);
                    let className = `${dmsans.className} w-full flex flex-row justify-between items-center cursor-pointer sm:text-xl text-md text-center text-black rounded-md my-0.5 p-3 active:scale-95 transition-all duration-100`;
                    if (questionAnswered && questionHasCorrectAnswer) {
                        if (userAnswerIds?.includes(o.oid)) {
                            if (correctIds?.includes(o.oid)) className += " bg-green hover:bg-green-dark text-white";
                            else className += " bg-red hover:bg-red-dark text-white animate-wiggle";
                        } else if (correctIds?.includes(o.oid)) className += " bg-red hover:bg-red-dark text-white animate-wiggle";
                        else className += " bg-white hover:bg-white-dark text-black";
                    } else if (questionAnswered && !questionHasCorrectAnswer) {
                        if (userAnswerIds?.includes(o.oid)) className += " bg-blue hover:bg-blue-dark text-white";
                        else className += " bg-white hover:bg-white-dark text-black";
                    } else if (!questionAnswered) {
                        if (selectedIds.includes(o.oid)) className += " bg-blue hover:bg-blue-dark text-white";
                        else className += " bg-white hover:bg-white-dark text-black";
                    }

                    return (
                        <button 
                            key={`option-${o.oid}`} 
                            className={className} 
                            onClick={() => toggleOption(o.oid)}
                        >
                            <div className="flex-1">
                                <div className={`border-2 border-black rounded-md h-6 w-6 p-0.5`}>
                                    { selected && <div className={`bg-black rounded-sm h-4 w-4`} /> }
                                </div>
                            </div>
                            <div className="justify-self-center">
                                {o.optionText}
                            </div>
                            <div className="flex-1"/>
                        </button>
                    )
                })}
            </div>
            <button 
                className={`${dmsans.className} mt-2 p-4 w-full rounded-md bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100`} 
                onClick={() => props.submitResponse(selectedIds)}
            >{"Submit"}</button>
        </div>
    )
}