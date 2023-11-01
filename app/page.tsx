"use client"

import { MultipleChoiceQuestion } from '@root/components/MultipleChoiceQuestion'
import { PageType, SessionType } from '@root/types/shared.types';
import { digitalStrip, dmsans } from '@root/styles/fonts';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Confetti from '@root/components/Confetti';
import data from "@root/public/question-flow.json";


export default function Home() {
	const [session, setSession] = useState<SessionType>();
	const [currentId, setCurrentId] = useState<number>(1);
	const [confetti, setConfetti] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<PageType>();

	useEffect(() => { setSession({pages: data.pages as Array<PageType>}) }, []);
	useEffect(() => { setCurrentPage(session?.pages.find(q => q.qid === currentId)) }, [session?.pages, currentId]);
	useEffect(() => {
		const handleKeyPressEvent = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") navigate(currentId, "forward");
			if (e.key === "ArrowLeft") navigate(currentId, "backward");
		};
		addEventListener("keydown", handleKeyPressEvent);
		return () => removeEventListener("keydown", handleKeyPressEvent);
	}, [currentId, session]);
	
	const navigate = (fromId: number, direction: "forward" | "backward", newSession?: SessionType) => {
		const thisSession = newSession || session;
		
		if (!thisSession) return;
		
		let toId = fromId;
		if (direction === "forward" && currentId < thisSession.pages.length) toId ++;
		if (direction === "backward" && currentId > 0) toId --;
		
		const currentQuestion = thisSession.pages.find(q => q.qid === fromId);
		if (!currentQuestion) return;
		if (direction === "forward" && currentQuestion.question && !currentQuestion.question.completed) return;

		const newQuestion = thisSession.pages.find(q => q.qid === toId);
		if (!newQuestion) return;
		if (!newQuestion.displayLogic) return setCurrentId(toId);
		
		const logicQuestionId = newQuestion.displayLogic.qid;
		const logicQuestion = thisSession.pages.find(q => q.qid === logicQuestionId);
		if (!logicQuestion?.question) return setCurrentId(toId);

		const correct = logicQuestion.question.selection.sort().join() === logicQuestion.question.correct.sort().join();
		if (correct === newQuestion.displayLogic.correct) setCurrentId(toId)
		else navigate(toId, direction, newSession);
	}

	const submitResponse = (questionId: number, selection: Array<number>) => {
		if (!session) return;
		const newPage = session.pages.find(p => p.qid === questionId);
		if (!newPage?.question) return;

		const correct = selection.sort().join() === newPage.question.correct.sort().join();
		newPage.question = { ...newPage.question, selection, completed: true };
		const newSession = { ...session, pages: session.pages.map(p => p.qid === questionId ? newPage : p) }
		setSession(newSession);
		if (correct) triggerConfetti();
		setTimeout(() => navigate(currentId, "forward", newSession), 1000);
	}

	const triggerConfetti = () => {
		setConfetti(true);
		setTimeout(() => setConfetti(false), 3000);
	}

	if (session && currentPage) {
		return (
			<div className="fixed h-screen w-screen flex-col items-center justify-center overflow-y-scroll">
				<div
					className="fixed h-screen w-screen"
				>
					<img 
						src={`/images/backgrounds/${currentPage.backgroundImage}`}
						alt="background image"
						className="h-full w-full object-cover brightness-50"
						onClick={() => navigate(currentId, "forward")}
					/>
				</div>
				
				{ currentPage.question && (
					<div className="absolute w-full min-h-full py-24 md:px-20 px-5 flex justify-center align-center">
						{ currentPage.question && <MultipleChoiceQuestion question={currentPage.question} submitResponse={(selection) => submitResponse(currentPage.qid, selection)} /> }
					</div>
				) }
				<div className="fixed w-full flex flex-col items-start">
					<div className="h-2 w-full bg-white opacity-80">
						<div className="h-full bg-blue" style={{width: `${session.pages.findIndex(p => p.qid === currentId) / session.pages.length * 100}%`}}/>
					</div>
					{ currentId > 1 ? (
						<div 
							className="flex flex-col m-2 items-center cursor-pointer active:scale-95 active:opacity-80"
							onClick={() => navigate(currentId, "backward")}	
						>
							<img
								src={`/images/misc/arrow-left-bold.svg`}
								alt="back"
								className="md:h-12 md:w-12 h-8 w-8 pointer-events-none"
							/>
							<p className={`${dmsans.className} text-white md:text-base text-sm`}>{"BACK"}</p>
						</div>
					) : null }
				</div>
				<div className="fixed md:bottom-10 md:left-10 bottom-3 left-3 pointer-events-none">
					{
						currentPage.avatarText && (
							<div className="md:w-96 md:max-w-96 w-64 mb-4 p-4 relative border-2 border-black rounded bg-white">
								<p className={`${digitalStrip.className} md:text-base text-sm text-black`}>
									{currentPage.avatarText}
								</p>
							</div>
						)
					}
					<img 
						src={`/images/avatars/${currentPage.avatarImage}`}
						alt="avatar" 
						className={`${currentPage.question && "scale-50"} md:h-56 md:w-56 h-24 w-24 rounded-full border-2 border-white transition-all duration-500 delay-75`}
					/>
				</div>
				{ !currentPage.question && (
					<div className="absolute flex flex-row items-end bottom-6 right-6 md:bottom-10 md:right-10 pointer-events-none">
						<p className="text-white text-right md:text-base text-sm md:w-48 w-32">{"click anywhere to go to the next page!"}</p>
						<img
							src={"/images/misc/finger.gif"}
							alt="click to continue"
							className="h-8 w-8 md:h-16 md:w-16"
						/>
					</div>
				) }
				{confetti && <Confetti />}
			</div>
		)
	} else return null;
}
