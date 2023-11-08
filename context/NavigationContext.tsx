import { ChapterType, DisplayLogicType, DisplayLogicTypes, PageTypes } from "@root/@types/shared.types";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useQuestionFlow } from "./QuestionFlowContext";

const NavigationContext = createContext<{
	currentIndex: number;
	navigate: (fromIndex: number, fallbackIndex: number, direction: "forward" | "backward", skippedQuestion: boolean) => void;
}>({
	currentIndex: 0,
	navigate: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({children}: {children: ReactNode}) => {
	const {chapter} = useQuestionFlow();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [shiftDown, setShiftDown] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const handleKeyPressEvent = (e: KeyboardEvent) => {
			if (!chapter) return;
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

    const navigate = (fromIndex: number, fallbackIndex: number, direction: "forward" | "backward", skippedQuestion: boolean) => {
		if (!chapter) return setCurrentIndex(fallbackIndex);

		const currentQuestion = chapter.pages[fromIndex];
		if (!currentQuestion) return setCurrentIndex(fallbackIndex);
		
		let toIndex = fromIndex;
		if (direction === "forward") {
			if (fromIndex >= chapter.pages.length - 1) return router.push(`/?previousChapter=${chapter.cid}`);
			if (shiftDown) return setCurrentIndex(fromIndex + 1);
			if (!skippedQuestion && currentQuestion.pageType === PageTypes.question && !currentQuestion.completed) return setCurrentIndex(fallbackIndex);
			toIndex ++;
		}

		if (direction === "backward") {
			if (fromIndex <= 0) return setCurrentIndex(fallbackIndex);
			if (shiftDown) return setCurrentIndex(fromIndex - 1);
			toIndex --;
		}

		const newQuestion = chapter.pages[toIndex];
		if (!newQuestion) return setCurrentIndex(fallbackIndex);
		if (!newQuestion.displayLogic) return setCurrentIndex(toIndex);
		
		const displayNextQuestion =  checkDisplayLogic(newQuestion.displayLogic, chapter);
		if (displayNextQuestion) setCurrentIndex(toIndex);
		else navigate(toIndex, fallbackIndex, direction, true);
	}

    const checkDisplayLogic = (displayLogic: DisplayLogicType, _chapter: ChapterType) => {
		if (displayLogic.type === DisplayLogicTypes.answeredCorrectly) {
			const logicQuestionId = displayLogic.pid;
			const logicQuestion = _chapter.pages.find(p => p.pid === logicQuestionId);
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

    return (
		<NavigationContext.Provider value={{
			currentIndex,
			navigate
		}}>
			{children}
		</NavigationContext.Provider>
	)
}
