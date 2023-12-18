"use client"

import { PageTypes, QuizIdType } from "@root/@types/shared.types";
import { Question } from "./QuestionTypes";
import { Narrator } from "./Narrator";
import { SuccessScreen } from "./ScreenTypes/SuccessScreen";
import { Title } from "./ScreenTypes/Title";
import { useQuestionFlow } from "@root/contexts/QuestionFlowContext";
import Confetti from "./Confetti";

export const ChapterContent = ({quizId}: {quizId: QuizIdType}) => {
    const {currentPage, confetti} = useQuestionFlow();
    if (!currentPage) return null;

    return (
        <>
            { currentPage.pageType === PageTypes.title && (
                <Title
                    title={currentPage.title} 
                    subtitle={currentPage.subtitle} 
                />
            ) }
            { currentPage.pageType === PageTypes.question && (
                <Question quizId={quizId} questionPage={currentPage} />
            ) }
            { (currentPage.pageType === PageTypes.question || currentPage.pageType === PageTypes.narrator) && (
                <Narrator 
                    avatarImage={currentPage.avatarImage} 
                    avatarText={currentPage.pageType === PageTypes.narrator ? currentPage.avatarText: undefined}
                    small={currentPage.pageType === PageTypes.question}
                />
            ) }
            { currentPage.pageType === PageTypes.success && (
                <SuccessScreen
                    title={currentPage.title}
                    subtitle={currentPage.subtitle}
                    avatarImage={currentPage.avatarImage}
                />
            ) }
            { confetti && <Confetti /> }

        </>
    )

}