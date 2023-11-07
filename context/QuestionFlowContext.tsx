import { ChapterType, PageTypes, QuestionTypes } from "@root/@types/shared.types";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const QuestionFlowContext = createContext<{
	chapter?: ChapterType;
	submitResponse: (pageId: string, userAnswer: Array<number> | string) => boolean | undefined;
	resetResponse: (pageId: string) => void;
}>({
	chapter: undefined,
	submitResponse: () => false,
	resetResponse: () => {},
});

export const useQuestionFlow = () => useContext(QuestionFlowContext);

export const QuestionFlowProvider = ({ children, chapterId }: { children: ReactNode; chapterId: string }) => {
    const [chapter, setChapter] = useState<ChapterType>();

    useEffect(() => { fetchChapter() }, []);

    const fetchChapter = async () => {
		const response = await fetch(`/api/chapters/${chapterId}`);
		const { data: chapter } = await response.json();
		setChapter(chapter);
	}

    const submitResponse = (pageId: string, userAnswer: Array<number> | string) => {
		if (!chapter) return false;
		const newPage = chapter.pages.find(p => p.pid === pageId);
		if (!newPage || newPage.pageType !== PageTypes.question) return false;

		if (newPage.question.correctAnswer) {
			let correct = false;
			if (newPage.question.questionType === QuestionTypes.MCSA && Array.isArray(userAnswer)) {
				correct = userAnswer.sort().join() === newPage.question.correctAnswer.sort().join();
			} else if (newPage.question.questionType === QuestionTypes.MCMA && Array.isArray(userAnswer)) {
				correct = userAnswer.sort().join() === newPage.question.correctAnswer.sort().join();
			} else if (newPage.question.questionType === QuestionTypes.RO && Array.isArray(userAnswer)) {
				correct = userAnswer.join() === newPage.question.correctAnswer.join();
			} else if ((newPage.question.questionType === QuestionTypes.VERB || newPage.question.questionType === QuestionTypes.EMAIL) && typeof userAnswer === "string") {
				const regex = new RegExp(newPage.question.correctAnswer, "i");
				correct = userAnswer.match(regex) !== null;
			}
			newPage.answeredCorrectly = correct;
		}
		newPage.question.userAnswer = userAnswer;
		newPage.completed = true;
		
		const newSession = { ...chapter, pages: chapter.pages.map(p => p.pid === pageId ? newPage : p) }
		setChapter(newSession);
		return newPage.answeredCorrectly;
	}

	const resetResponse = (pageId: string) => {
		if (!chapter) return;
		const newPage = chapter.pages.find(p => p.pid === pageId);
		if (!newPage || newPage.pageType !== PageTypes.question) return;

		newPage.question.userAnswer = undefined;
		newPage.completed = false;
		newPage.answeredCorrectly = undefined;
		
		const newSession = { ...chapter, pages: chapter.pages.map(p => p.pid === pageId ? newPage : p) }
		setChapter(newSession);
	}

	return (
		<QuestionFlowContext.Provider value={{
			chapter,
			submitResponse,
			resetResponse,
		}}>
			{children}
		</QuestionFlowContext.Provider>
	)
}