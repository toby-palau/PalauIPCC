"use client"

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ChapterType, DisplayLogicType, DisplayLogicTypes, PageTypes, QuestionTypes } from "@root/@types/shared.types";
import { useRouter } from "next/navigation";

const QuestionFlowContext = createContext<{
	chapterId?: string;
	currentIndex?: number;
	currentPage?: ChapterType["pages"][number];
	progress?: number;
	confetti: boolean;
	submitResponse: (pageId: string, userAnswer: Array<number> | string) => boolean | undefined;
	resetResponse: (pageId: string) => void;
	calculateScore: () => { correct: number; total: number };
	navigate: (fromIndex: number, fallbackIndex: number, direction: "forward" | "backward", skippedQuestion: boolean) => void;
}>({
	chapterId: undefined,
	currentIndex: undefined,
	currentPage: undefined,
	progress: undefined,
	confetti: false,
	submitResponse: () => false,
	resetResponse: () => {},
	calculateScore: () => ({correct: 0, total: 0}),
	navigate: () => {},
});

export const useQuestionFlow = () => useContext(QuestionFlowContext);

export const QuestionFlowProvider = ({ children, chapter }: { children: ReactNode; chapter: ChapterType }) => {
    const router = useRouter();
	const [userSession, setUserSession] = useState<ChapterType>(chapter);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [progress, setProgress] = useState<number>(0);
	const [shiftDown, setShiftDown] = useState<boolean>(false);
	const [confetti, setConfetti] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<ChapterType["pages"][number]>();

	
	useEffect(() => {
		if (!userSession) return;
		setCurrentPage(userSession.pages[currentIndex]);
		setProgress((currentIndex / userSession.pages.length) * 100);
	}, [currentIndex]);

	/**
	 * Handle keyboard navigation
	 */
	useEffect(() => {
        const handleKeyPressEvent = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") navigate(currentIndex, currentIndex, "forward", false);
			if (e.key === "ArrowLeft") navigate(currentIndex, currentIndex, "backward", false);
            if (e.key === "Shift") setShiftDown(true);
        }
        const handleKeyUpEvent = (e: KeyboardEvent) => {
			if (e.key === "Shift") setShiftDown(false);
		}
        addEventListener("keydown", handleKeyPressEvent);
		addEventListener("keyup", handleKeyUpEvent);
        return () => {
            removeEventListener("keydown", handleKeyPressEvent);
            removeEventListener("keyup", handleKeyUpEvent);
        }
    }, [currentIndex, shiftDown]);

	/**
	 * Submit a response for a question
	 * @param pageId 
	 * @param userAnswer 
	 */
    const submitResponse = (pageId: string, userAnswer: Array<number> | string) => {
		if (!userSession) return false;
		const newPage = userSession.pages.find(p => p.pid === pageId);
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
			if (correct) triggerConfetti();
			newPage.answeredCorrectly = correct;
		}
		newPage.question.userAnswer = userAnswer;
		newPage.completed = true;
		
		const newSession = { ...userSession, pages: userSession.pages.map(p => p.pid === pageId ? newPage : p) }
		setUserSession(newSession);
		setTimeout(() => navigate(currentIndex, currentIndex, "forward", false), 1000);
	}

	/**
	 * Clear the response for a question 
	 * @param pageId 
	 * @returns 
	 */
	const resetResponse = (pageId: string) => {
		if (!userSession) return;

		const newPage = userSession.pages.find(p => p.pid === pageId);
		if (!newPage || newPage.pageType !== PageTypes.question) return;

		newPage.question.userAnswer = undefined;
		newPage.completed = false;
		newPage.answeredCorrectly = undefined;
		
		const newSession = { ...userSession, pages: userSession.pages.map(p => p.pid === pageId ? newPage : p) }
		setUserSession(newSession);
	}

	/**
	 * Calculate the score for the current chapter
	 * @returns number of correct answers and total number of questions
	 */
	const calculateScore = () => {
		if (!userSession) return { correct: 0, total: 0 };
		const correct = userSession.pages.filter(p => p.pageType === PageTypes.question && p.answeredCorrectly).length;
		const total = userSession.pages.filter(p => p.pageType === PageTypes.question && p.completed && p.question.correctAnswer !== undefined).length;
		return { correct, total };
	}

	/**
	 * Navigate forward or backward in the chapter
	 * @param fromIndex 
	 * @param fallbackIndex 
	 * @param direction 
	 * @param skippedQuestion 
	 */
	const navigate = (fromIndex: number, fallbackIndex: number, direction: "forward" | "backward", skippedQuestion: boolean) => {
		if (!userSession) return;

		const currentQuestion = userSession.pages[fromIndex];
		if (!currentQuestion) return setCurrentIndex(fallbackIndex);
		
		let toIndex = fromIndex;
		if (direction === "forward") {
			if (fromIndex >= userSession.pages.length - 1) return router.push(`/?previousChapter=${userSession.cid}`);
			if (shiftDown) return setCurrentIndex(fromIndex + 1);
			if (!skippedQuestion && currentQuestion.pageType === PageTypes.question && !currentQuestion.completed) return setCurrentIndex(fallbackIndex);
			toIndex ++;
		}

		if (direction === "backward") {
			if (fromIndex <= 0) return setCurrentIndex(fallbackIndex);
			if (shiftDown) return setCurrentIndex(fromIndex - 1);
			toIndex --;
		}

		const newQuestion = userSession.pages[toIndex];
		if (!newQuestion) return setCurrentIndex(fallbackIndex);
		if (!newQuestion.displayLogic) return setCurrentIndex(toIndex);
		
		const displayNextQuestion =  checkDisplayLogic(newQuestion.displayLogic);
		if (displayNextQuestion) setCurrentIndex(toIndex);
		else navigate(toIndex, fallbackIndex, direction, true);
	}

	/**
	 * Check display logic for a question
	 * @param displayLogic 
	 * @param _chapter 
	 * @returns 
	 */
    const checkDisplayLogic = (displayLogic: DisplayLogicType) => {
		if (!userSession) return false;

		if (displayLogic.type === DisplayLogicTypes.answeredCorrectly) {
			const logicQuestionId = displayLogic.pid;
			const logicQuestion = userSession.pages.find(p => p.pid === logicQuestionId);
			if (!logicQuestion || logicQuestion?.pageType !== PageTypes.question) return false;
			if (logicQuestion.completed && logicQuestion.answeredCorrectly === displayLogic.correct) return true;
			else return false;
		}
		if (displayLogic.type === DisplayLogicTypes.seenBefore) {
			const ts = localStorage.getItem(displayLogic.localStorageIndentifier);
			if (ts) return false;
			localStorage.setItem(displayLogic.localStorageIndentifier, Date.now().toString());
			return true;
		}
	}

	const triggerConfetti = () => {
		setConfetti(true);
		setTimeout(() => setConfetti(false), 3000);
	}


	return (
		<QuestionFlowContext.Provider value={{
			chapterId: userSession?.cid,
			currentIndex,
			currentPage,
			progress,
			confetti,
			calculateScore,
			submitResponse,
			resetResponse,
			navigate,
		}}>
			{children}
		</QuestionFlowContext.Provider>
	)
}