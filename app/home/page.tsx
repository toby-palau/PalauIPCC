"use client"

import { MultipleChoiceQuestion } from '@root/components/MultipleChoiceQuestion'
import { PalauImage } from '@root/components/PalauImage';
import { PageType, SessionType } from '@root/types/shared.types';
import { digitalStrip } from '@root/styles/fonts';
import { useState, useEffect, useMemo } from 'react';
import Confetti from '@root/components/Confetti';


export default function Home() {
	const [session, setSession] = useState<SessionType>();
	const [currentId, setCurrentId] = useState<number>(1);
	const [confetti, setConfetti] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<PageType>();

	useEffect(() => { fetchQuestions() }, []);
	useEffect(() => { setCurrentPage(session?.pages.find(q => q.qid === currentId)) }, [session?.pages, currentId]);

	// addEventListener("keydown", (e: KeyboardEvent) => {
	// 	if (e.key === "ArrowRight") navigate(currentId, "forward");
	// 	if (e.key === "ArrowLeft") navigate(currentId, "backward");
	// });
	
	const fetchQuestions = async () => {
		const response = await fetch(`http://localhost:3000/api/questions`);
		const {data} = await response.json();
		setSession({pages: data});
	}
	
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
		setTimeout(() => navigate(currentId, "forward", newSession), 500);
	}

	const triggerConfetti = () => {
		setConfetti(true);
		setTimeout(() => setConfetti(false), 3000);
	}

	if (session && currentPage) {
		return (
			<div className="h-screen w-screen">
				<div className="fixed h-screen w-screen flex-col items-center justify-center">
					<PalauImage 
						src={`backgrounds/${currentPage.backgroundImage}`}
						alt="background image"
						layout="fill"
						objectFit="cover"
						onClick={() => navigate(currentId, "forward")}
					/>
					{ currentPage.question && (
						<div className="absolute w-full min-h-full p-10 sm:p-20 flex justify-center align-center">
							{ currentPage.question && <MultipleChoiceQuestion question={currentPage.question} submitResponse={(selection) => submitResponse(currentPage.qid, selection)} /> }
						</div>
					) }
					<div className="absolute w-full">
						<div className="h-2 w-full bg-white opacity-80">
							<div className="h-full bg-blue" style={{width: `${session.pages.findIndex(p => p.qid === currentId) / session.pages.length * 100}%`}}/>
						</div>
						<PalauImage
							src={`misc/arrow-left-bold.svg`}
							alt="back"
							width={50}
							height={50}
							onClick={() => navigate(currentId, "backward")}
							className="cursor-pointer"
						/>
					</div>
					<div className="absolute bottom-10 left-10">
						{
							currentPage.avatarText && (
								<div className="w-96 mb-4 p-4 relative border-2 border-black rounded bg-white">
									<p className={`${digitalStrip.className} text-black`}>
										{currentPage.avatarText}
									</p>
								</div>
							)
						}
						<PalauImage 
							src={`avatars/${currentPage.avatarImage}`}
							alt="avatar" 
							className={`${currentPage.question ? "h-24 w-24" : "h-56 w-56"} rounded-full border-2 border-white transition- duration-500`}
						/>
					</div>
					{confetti && <Confetti />}
				</div>
			</div>
		)
	} else return null;
}
