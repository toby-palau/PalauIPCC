"use server";
import { QuizIdType } from "@root/@types/shared.types";
import Link from "next/link";

const DisclaimerContent = {
	ipcc: {
		logo: "/images/misc/ipcc-logo.png",
		p1: "The content for this experience was generated based on the",
		p2: "2023 IPCC Synthesis Report",
		p3: "",
		link: "https://www.ipcc.ch/report/sixth-assessment-report-cycle/",
	},
	cop: {
		logo: "/images/misc/cop-logo.png",
		p1: "The content for this experience was generated based on ",
		p2: "multiple sources",
		p3: " about the 2023 COP28 Climate Change Conference",
		link: "https://docs.google.com/document/d/1xvsPmrxZI_JyYwFcLGUtgE5IkwrUACLsfsx3atTc5mo/edit?usp=sharing",
	},
	uob: {
		logo: "/images/misc/uob-logo.png",
		p1: "",
		p2: "",
		p3: "",
		link: "https://www.uobgroup.com/uobgroup/default.page",
	},
	test: {
		logo: "/images/misc/uob-logo.png",
		p1: "",
		p2: "",
		p3: "",
		link: "",
	},
};

export const Disclaimer = ({ quizId }: { quizId: QuizIdType }) => {
	return (
		<div className="flex flex-row items-center justify-end md:px-0 px-5 md:py-0 py-5">
			<p className={`w-72 text-xs text-white text-right mx-4`}>
				{DisclaimerContent[quizId].p1}
				<Link
					href={DisclaimerContent[quizId].link}
					className={"text-blue hover:text-blue-dark underline"}
					target="_blank"
				>
					{DisclaimerContent[quizId].p2}
				</Link>
				{DisclaimerContent[quizId].p3}.
			</p>
			<img src={DisclaimerContent[quizId].logo} className="w-16 " />
		</div>
	);
};
