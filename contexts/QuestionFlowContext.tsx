"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ChapterType, DisplayLogicType, DisplayLogicTypes, PageTypes } from "@root/@types/shared.types";
import { useRouter } from "next/navigation";
import { createNewResponse, resetExistingResponse } from "@root/services/DatabaseService";
import { updateQuestionPage } from "@root/services/QuestionFlowService";
import { useAuth } from "./AuthContext";
import { track } from "@vercel/analytics";

const QuestionFlowContext = createContext<{
	chapterId?: string;
	currentIndex?: number;
	currentPage?: ChapterType["pages"][number];
	progress?: number;
	confetti: boolean;
	disableQuestionAnswers: boolean;
	submitResponse: (pageId: string, userAnswer: Array<string> | string) => void;
	resetResponse: (pageId: string) => void;
	calculateScore: () => { correct: number; total: number };
	navigate: (fromIndex: number, fallbackIndex: number, direction: "forward" | "backward", skippedQuestion: boolean) => void;
	skipQuestion: (pageId: string) => void;
}>({
	chapterId: undefined,
	currentIndex: undefined,
	currentPage: undefined,
	progress: undefined,
	confetti: false,
	disableQuestionAnswers: false,
	submitResponse: () => false,
	resetResponse: () => {},
	calculateScore: () => ({correct: 0, total: 0}),
	navigate: () => {},
	skipQuestion: () => {},
});

export const useQuestionFlow = () => useContext(QuestionFlowContext);

export const QuestionFlowProvider = ({ children, initialSession, nextChapterId }: { children: ReactNode; initialSession: ChapterType; nextChapterId?: string }) => {
    const router = useRouter();
	const {userId} = useAuth();
	const [userSession, setUserSession] = useState<ChapterType>(initialSession);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [progress, setProgress] = useState<number>(0);
	const [shiftDown, setShiftDown] = useState<boolean>(false);
	const [confetti, setConfetti] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<ChapterType["pages"][number]>();
	const [triggerTimeoutToNextQuestion, setTriggerTimeoutToNextQuestion] = useState<boolean>(false);
	const [disableQuestionAnswers, setDisableQuestionAnswers] = useState<boolean>(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

	useEffect(() => {
		const lastQuestionIndex = initialSession.pages.findLastIndex(p => p.pageType === PageTypes.question && !p.question.skippable);
		const lastCompletedIndex = initialSession.pages.findLastIndex(p => p.pageType === PageTypes.question && p.completed);
		const successIndex = initialSession.pages.findLastIndex(p => p.pageType === PageTypes.success);
		if (lastCompletedIndex < 0) setCurrentIndex(0);
		else if (lastCompletedIndex < lastQuestionIndex) setCurrentIndex(lastCompletedIndex + 1);
		else if (lastCompletedIndex >= lastQuestionIndex) setCurrentIndex(successIndex);
	}, []);

	useEffect(() => {
		if (!triggerTimeoutToNextQuestion) return;
		setTimeout(() => navigate(currentIndex, currentIndex, "forward", false), 1000);
		setTriggerTimeoutToNextQuestion(false);
	}, [triggerTimeoutToNextQuestion])
	
	useEffect(() => {
		if (!userSession) return;
		setCurrentPage(userSession.pages[currentIndex]);
		setProgress((currentIndex / userSession.pages.length) * 100);
	}, [currentIndex, userSession]);

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
    const submitResponse = async (pageId: string, userAnswer: Array<string> | string) => {
		setDisableQuestionAnswers(true);
		if (!userSession) return;
		let page = userSession.pages.find(p => p.pid === pageId);
		if (!page || page.pageType !== PageTypes.question) return;

		const newPage = await updateQuestionPage(page, { userAnswer, questionType: page.question.questionType });
		if (newPage.answeredCorrectly) triggerConfetti();

		if (userSession.pages.filter(p => p.pageType === PageTypes.question && p.completed).length <= 0) track("Chapter Submit First Question", {chapterId: userSession.cid, chapterTitle: userSession.chapterTitle});
		if (userSession.pages.findLastIndex(p => p.pageType === PageTypes.question && !p.question.skippable) === currentIndex) track("Chapter Submit Last Question", {chapterId: userSession.cid, chapterTitle: userSession.chapterTitle});

		const newSession = {
			...userSession, 
			pages: userSession.pages.map(p => p.pid === pageId ? newPage : p),
		};
		
		setUserSession(newSession);
		createNewResponse(userId, pageId, newPage.question.questionType, userAnswer, newPage.answeredCorrectly);


		setTriggerTimeoutToNextQuestion(true);
	}

	/**
	 * Skip a question
	 * @param pageId 
	 */
	const skipQuestion = (pageId: string) => {
		if (!userSession) return;
		setUserSession({ ...userSession, pages: userSession.pages.map(p => p.pid === pageId ? { ...p, completed: true } : p) });
		navigate(currentIndex, currentIndex, "forward", false);
	}

	/**
	 * Clear the response for a question 
	 * @param pageId 
	 * @returns 
	 */
	const resetResponse = async (pageId: string) => {
		if (!userSession) return;

		let page = userSession.pages.find(p => p.pid === pageId);
		if (!page || page.pageType !== PageTypes.question) return;
		
		const newPage = await updateQuestionPage(page);
		const newSession = { ...userSession, pages: userSession.pages.map(p => p.pid === pageId ? newPage : p) }
		setUserSession(newSession);

		resetExistingResponse(userId, pageId);
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
		setDisableQuestionAnswers(false);
		if (!userSession) return;
		
		const currentQuestion = userSession.pages[fromIndex];
		if (!currentQuestion) return setCurrentIndex(fallbackIndex);
		
		let toIndex = fromIndex;
		if (direction === "forward") {
			if (fromIndex >= userSession.pages.length - 1) return router.push(nextChapterId ? `/chapters/${nextChapterId}` : `/`);
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
		if (timeoutId) clearTimeout(timeoutId);
		setConfetti(false);
		setTimeout(() => setConfetti(true), 10);
		const newTimeoutId = setTimeout(() => setConfetti(false), 3500);
		setTimeoutId(newTimeoutId);
	}

	return (
		<QuestionFlowContext.Provider value={{
			chapterId: userSession?.cid,
			currentIndex,
			currentPage,
			progress,
			confetti,
			disableQuestionAnswers,
			calculateScore,
			submitResponse,
			resetResponse,
			navigate,
			skipQuestion,
		}}>
			{children}
		</QuestionFlowContext.Provider>
	)
}