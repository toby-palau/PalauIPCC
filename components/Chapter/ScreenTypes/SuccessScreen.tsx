"use client";

import { rocksalt, staatliches } from "@root/styles/fonts";
import { useQuestionFlow } from "@root/contexts/QuestionFlowContext";
import { useEffect, useState } from "react";

type SuccessProps = {
	title: string;
	subtitle: string;
	avatarImage: string;
};

const greenFilter = {
	filter: "sepia(89%) saturate(972%) hue-rotate(41deg) brightness(82%) contrast(95%)",
};

export const SuccessScreen = ({
	title,
	subtitle,
	avatarImage,
}: SuccessProps) => {
	const [startAnimations, setStartAnimations] = useState<boolean>(false);
	const { calculateScore } = useQuestionFlow();
	const [score, setScore] = useState<number>(0);

	useEffect(() => {
		setStartAnimations(true);
		const { correct, total } = calculateScore();
		if (total === 0) setScore(1);
		else setScore(correct / total);
	}, []);

	return (
		<div className="absolute min-h-full w-full flex flex-col justify-center items-center p-10 pointer-events-none">
			<h1
				className={`${staatliches.className} md:text-6xl text-4xl text-white text-center`}
			>
				{title}
			</h1>
			<h2
				className={`${
					rocksalt.className
				} md:text-6xl text-2xl text-green ${
					startAnimations
						? "-rotate-6 scale-100 opacity-100"
						: "-rotate-12 scale-150 opacity-20"
				} md:-mt-6 -mt-4 mb-4 transition duration-1000`}
			>
				{subtitle}
			</h2>
			<img
				src={`/images/avatars/${avatarImage}`}
				alt="avatar"
				className={`md:w-96 w-64 ${
					startAnimations ? "scale-100" : "scale-0"
				} rounded-full border-4 border-white transform transition duration-1000`}
			/>
			<div className="flex flex-row md:-mt-12 -mt-4 z-10 animate-pulse">
				{
					[1, 2, 3, 4, 5].map((i) => (
						<img
							src="/images/misc/star.svg"
							alt="star"
							key={`star-${i}`}
							className={"h-8 w-8 md:h-16 md:w-16"}
							style={score >= i / 5 ? greenFilter : {}}
						/>
					))
					// stars.map((star, i) => (
					//     <img
					//         src="/images/misc/star.svg"
					//         alt="star"
					//         key={`star-${i}`}
					//         className={"h-8 w-8 md:h-16 md:w-16"}
					//         style={star}
					//     />
					// ))
				}
			</div>
		</div>
	);
};
