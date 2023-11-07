"use client"

import { PageTypes, QuestionTypes, QuestionPageType, ChapterType } from "@root/@types/shared.types";
import { dmsans } from "@root/styles/fonts";
import { useState, useMemo } from "react";
import Confetti from "@root/components/Confetti";
import { Narrator } from "@root/components/Narrator";
import { Title } from "@root/components/Title";
import { MultipleChoiceSingleAnswerQuestion } from "@root/components/QuestionTypes/MultipleChoiceSingleAnswerQuestion"
import { VerbatimQuestion } from "@root/components/QuestionTypes/VerbatimQuestion"
import { RankOrderQuestion } from "@root/components/QuestionTypes/RankOrderQuestion";
import { MultipleChoiceMultiAnswerQuestion } from "@root/components/QuestionTypes/MultipleChoiceMultiAnswerQuestion";
import { useRouter } from "next/navigation";
import { EmailQuestion } from "@root/components/QuestionTypes/EmailQuestion";
import { NavigationProvider, useNavigation } from "@root/context/NavigationContext";
import { QuestionFlowProvider, useQuestionFlow } from "@root/context/QuestionFlowContext";

const Page = () => {
	const router = useRouter();
	const [confetti, setConfetti] = useState<boolean>(false);
	const {currentIndex, navigate} = useNavigation();
	const {chapter, submitResponse, resetResponse} = useQuestionFlow();

	const currentPage = useMemo<ChapterType["pages"][number] | undefined>(() => {
		if (!chapter) return;
		return chapter.pages[currentIndex];
	}, [currentIndex, chapter]);

	const triggerConfetti = () => {
		setConfetti(true);
		setTimeout(() => setConfetti(false), 3000);
	}

	const handleSubmitResponse = (pageId: string, response: Array<number> | string) => {
		if (!currentPage || !chapter) return;
		const answeredCorrectly = submitResponse(pageId, response);
		if (answeredCorrectly) triggerConfetti();
		setTimeout(() => navigate(currentIndex, currentIndex, "forward", false), 1000);
	}

	if (chapter && currentPage) {
		return (
			<div className="fixed h-screen w-screen flex-col items-center justify-center overflow-y-scroll">
				<div 
					id="background" 
					className="fixed h-screen w-screen"
					onClick={() => navigate(currentIndex, currentIndex, "forward", false)}
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
						onClick={currentIndex > 0 ? () => navigate(currentIndex, currentIndex, "backward", false) : undefined}	
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
						<Question question={currentPage.question} submitResponse={r => handleSubmitResponse(currentPage.pid, r)} resetResponse={() => resetResponse(currentPage.pid)} /> 
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

const PageWrapper = ({ params: { chapterId } }: { params: { chapterId: string } }) => (
	<QuestionFlowProvider chapterId={chapterId}>
		<NavigationProvider>
			<Page/>
		</NavigationProvider>
	</QuestionFlowProvider>
);

export default PageWrapper;