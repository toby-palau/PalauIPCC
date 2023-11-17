"use client"

import { QuestionPageType, QuestionTypes } from "@root/@types/shared.types";
import { MultipleChoiceSingleAnswerQuestion } from "./MultipleChoiceSingleAnswerQuestion";
import { MultipleChoiceMultiAnswerQuestion } from "./MultipleChoiceMultiAnswerQuestion";
import { RankOrderQuestion } from "./RankOrderQuestion";
import { VerbatimQuestion } from "./VerbatimQuestion";
import { EmailQuestion } from "./EmailQuestion";
import { useQuestionFlow } from "@root/contexts/QuestionFlowContext";

export const Question = ({questionPage}: {questionPage: QuestionPageType}) => {
    const { disableQuestionAnswers, submitResponse, resetResponse, skipQuestion } = useQuestionFlow();
    const { question } = questionPage;

    return (
        <div className="absolute w-full min-h-full py-24 md:px-20 px-5 flex justify-center align-center">
            { question.questionType === QuestionTypes.MCSA && (
                <MultipleChoiceSingleAnswerQuestion
                    question={question} 
                    submitResponse={response => submitResponse(questionPage.pid, response)}
                    disabled={disableQuestionAnswers}
                />
            ) }
            { question.questionType === QuestionTypes.MCMA && (
                <MultipleChoiceMultiAnswerQuestion
                    question={question}
                    submitResponse={response => submitResponse(questionPage.pid, response)}
                    resetResponse={() => resetResponse(questionPage.pid)}
                    disabled={disableQuestionAnswers}
                />
            ) }
            { question.questionType === QuestionTypes.RO && (
                <RankOrderQuestion
                    question={question}
                    submitResponse={response => submitResponse(questionPage.pid, response)}
                    resetResponse={() => resetResponse(questionPage.pid)}
                    disabled={disableQuestionAnswers}
                />
            ) }
            { question.questionType === QuestionTypes.VERB && (
                <VerbatimQuestion
                    question={question}
                    submitResponse={response => submitResponse(questionPage.pid, response)}
                    disabled={disableQuestionAnswers}
                />
            ) }
            { question.questionType === QuestionTypes.EMAIL && (
                <EmailQuestion 
                    question={question}
                    submitResponse={response => submitResponse(questionPage.pid, response)}
                    skipQuestion={() => skipQuestion(questionPage.pid)}
                    disabled={disableQuestionAnswers}
                />
            ) }
        </div>
    )
}