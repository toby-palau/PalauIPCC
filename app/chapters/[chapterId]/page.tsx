"use client"

import { PageTypes, QuestionTypes, QuestionPageType, ChapterType, DisplayLogicType, DisplayLogicTypes } from '@root/@types/shared.types';
import { dmsans } from '@root/styles/fonts';
import { useState, useEffect, useMemo } from 'react';
import Confetti from '@root/components/Confetti';
import { Narrator } from '@root/components/Narrator';
import { Title } from '@root/components/Title';
import { MultipleChoiceSingleAnswerQuestion } from "@root/components/QuestionTypes/MultipleChoiceSingleAnswerQuestion"
import { VerbatimQuestion } from "@root/components/QuestionTypes/VerbatimQuestion"
import { RankOrderQuestion } from '@root/components/QuestionTypes/RankOrderQuestion';
import { MultipleChoiceMultiAnswerQuestion } from '@root/components/QuestionTypes/MultipleChoiceMultiAnswerQuestion';
import { useRouter } from 'next/navigation';
import { EmailQuestion } from '@root/components/QuestionTypes/EmailQuestion';

const Page = ({ params: { chapterId } }: { params: { chapterId: string } }) => {
	const router = useRouter();
	const [shiftDown, setShiftDown] = useState<boolean>(false);
	const [chapter, setChapter] = useState<ChapterType>();
	const [confetti, setConfetti] = useState<boolean>(false);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const currentPage = useMemo<ChapterType["pages"][number] | undefined>(() => {
		if (!chapter) return;
		return chapter.pages[currentIndex];
	}, [currentIndex, chapter]);

	useEffect(() => { fetchChapter() }, []);
	useEffect(() => {
		const handleKeyPressEvent = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") navigate(currentIndex, currentIndex, "forward");
			if (e.key === "ArrowLeft") navigate(currentIndex, currentIndex, "backward");
			if (e.key === "Shift") setShiftDown(true);
		};
		const handleKeyUpEvent = (e: KeyboardEvent) => {
			if (e.key === "Shift") setShiftDown(false);
		}
		addEventListener("keydown", handleKeyPressEvent);
		addEventListener("keyup", handleKeyUpEvent);
		return () => {
			removeEventListener("keydown", handleKeyPressEvent);
			removeEventListener("keyup", handleKeyUpEvent);
		}
	}, [currentIndex, chapter, shiftDown]);

	const fetchChapter = async () => {
		const response = await fetch(`/api/chapters/${chapterId}`);
		const { data: chapter } = await response.json();
		setChapter(chapter);
	}


	
	const navigate = (fromIndex: number, fallbackIndex: number, direction: "forward" | "backward", skippedQuestion?: boolean, newChapter?: ChapterType) => {
		const thisChapter = newChapter ?? chapter;

		if (!thisChapter) return setCurrentIndex(fallbackIndex);

		const currentQuestion = thisChapter.pages[fromIndex];
		if (!currentQuestion) return setCurrentIndex(fallbackIndex);
		

		let toIndex = fromIndex;
		if (direction === "forward") {
			if (fromIndex >= thisChapter.pages.length - 1) return router.push("/");
			if (shiftDown) return setCurrentIndex(fromIndex + 1);
			if (!skippedQuestion && currentQuestion.pageType === PageTypes.question && !currentQuestion.completed) return setCurrentIndex(fallbackIndex);
			toIndex ++;
		}

		if (direction === "backward") {
			if (fromIndex <= 0) return setCurrentIndex(fallbackIndex);
			if (shiftDown) return setCurrentIndex(fromIndex - 1);
			toIndex --;
		}

		const newQuestion = thisChapter.pages[toIndex];
		if (!newQuestion) return setCurrentIndex(fallbackIndex);
		if (!newQuestion.displayLogic) return setCurrentIndex(toIndex);
		
		const displayNextQuestion =  checkDisplayLogic(newQuestion.displayLogic, thisChapter);
		if (displayNextQuestion) setCurrentIndex(toIndex);
		else navigate(toIndex, fallbackIndex, direction, true, thisChapter);
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

	const submitResponse = (pageId: string, userAnswer: Array<number> | string) => {
		if (!chapter) return;
		const newPage = chapter.pages.find(p => p.pid === pageId);
		if (!newPage || newPage.pageType !== PageTypes.question) return;

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
		
		const newSession = { ...chapter, pages: chapter.pages.map(p => p.pid === pageId ? newPage : p) }
		setChapter(newSession);
		setTimeout(() => navigate(currentIndex, currentIndex, "forward", false, newSession), 1000);
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

	const triggerConfetti = () => {
		setConfetti(true);
		setTimeout(() => setConfetti(false), 3000);
	}

	if (chapter && currentPage) {
		return (
			<div className="fixed h-screen w-screen flex-col items-center justify-center overflow-y-scroll">
				<div 
					id="background" 
					className="fixed h-screen w-screen"
					onClick={() => navigate(currentIndex, currentIndex, "forward")}
				>
					<img 
						src={`/images/backgrounds/${currentPage.backgroundImage}`}
						alt="background image"
						className="absolute h-full w-full object-cover brightness-50"
					/>
					{ currentPage.pageType !== PageTypes.question && (
					<div className="absolute flex flex-row items-end bottom-10 right-10 pointer-events-none">
						<p className="text-white text-right md:text-base text-sm md:w-48 w-32">{"click anywhere to go to the next page!"}</p>
						<img
							src={"/images/misc/finger.gif"}
							alt="click to continue"
							className="h-8 w-8 md:h-16 md:w-16"
						/>
					</div>
				) }
				</div>

				<div id="header" className="fixed w-full flex flex-col items-start z-10">
					<div id="progress-bar" className="h-2 w-full bg-white opacity-80">
						<div className="h-full bg-blue" style={{width: `${currentIndex / chapter.pages.length * 100}%`}}/>
					</div>
					<div className="flex flex-row w-full justify-between">
						
					<div 
						id="back-button"
						className="flex flex-col m-2 items-center cursor-pointer active:scale-95 active:opacity-80"
						onClick={currentIndex > 0 ? () => navigate(currentIndex, currentIndex, "backward") : undefined}	
					>
						{ currentIndex > 0 && (
							<>
								<img
									src={`/images/misc/arrow-left-bold.svg`}
									alt="back"
									className="md:h-12 md:w-12 h-8 w-8 pointer-events-none"
								/>
								<p className={`${dmsans.className} text-white md:text-base text-sm`}>{"BACK"}</p>
							</>
						) }
						</div>
						<div 
							id="home-button"
							className="flex flex-col m-2 items-center cursor-pointer active:scale-95 active:opacity-80"
							onClick={() => router.push("/")}
						>
							<img 
								src="/images/misc/home.svg"
								alt="home"
								className="md:h-12 md:w-12 h-8 w-8 w-8 pointer-events-none"
							/>
							<p className={`${dmsans.className} text-white md:text-base text-sm`}>{"HOME"}</p>
						</div>
					</div>
				</div>

				{ currentPage.pageType === PageTypes.title && <Title title={currentPage.title} subtitle={currentPage.subtitle} />}

				{ currentPage.pageType === PageTypes.question && (
					<div className="absolute w-full min-h-full py-24 md:px-20 px-5 flex justify-center align-center">
						<Question question={currentPage.question} submitResponse={r => submitResponse(currentPage.pid, r)} resetResponse={() => resetResponse(currentPage.pid)} /> 
					</div>
				) }

				{ (currentPage.pageType === PageTypes.narrator || currentPage.pageType === PageTypes.question) && (
					<Narrator 
					avatarImage={currentPage.avatarImage} 
					avatarText={currentPage.pageType === PageTypes.narrator ? currentPage.avatarText : undefined} 
					small={currentPage.pageType === PageTypes.question}
					/> 
				) }
				
				{ confetti && <Confetti /> }
			</div>
		)
	} else return null;
}

type QuestionProps = {
    question: QuestionPageType["question"];
    submitResponse: (r: Array<number> | string) => void;
	resetResponse: () => void;
}

const Question = ({ question, submitResponse, resetResponse }: QuestionProps) => {
    if (question.questionType === QuestionTypes.MCSA) return (
		<MultipleChoiceSingleAnswerQuestion
			question={question} 
			submitResponse={submitResponse} 
		/>
    )
    if (question.questionType === QuestionTypes.MCMA) return (
		<MultipleChoiceMultiAnswerQuestion
			question={question}
			submitResponse={submitResponse} 
			resetResponse={resetResponse}
		/>
    )
    if (question.questionType === QuestionTypes.RO) return (
		<RankOrderQuestion
			question={question}
			submitResponse={submitResponse}
			resetResponse={resetResponse}
		/>
    )
    if (question.questionType === QuestionTypes.VERB) return (
		<VerbatimQuestion 
			question={question}
			submitResponse={submitResponse}
		/>
    )
    if (question.questionType === QuestionTypes.EMAIL) return (
		<EmailQuestion 
			question={question}
			submitResponse={submitResponse}
		/>
    )
}

export default Page;