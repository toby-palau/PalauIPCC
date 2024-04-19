"use server";

import { Response } from "@prisma/client";
import {
	ChapterInfoType,
	ChapterType,
	PageTypes,
	QuestionFlowType,
	QuestionPageType,
	QuestionTypes,
	QuizIdType,
} from "@root/@types/shared.types";
import fs from "fs";
import path from "path";

const filePath = {
	ipcc: path.resolve("data", "ipcc-question-flow.json"),
	cop: path.resolve("data", "cop-question-flow.json"),
	uob: path.resolve("data", "uob-question-flow.json"),
	esrs: path.resolve("data", "esrs-question-flow.json"),
	"esrs-m1": path.resolve("data", "esrs-m1-question-flow.json"),
	// "esrs-m2": path.resolve("data", "esrs-m2-question-flow.json"),
	acronyms: path.resolve("data", "acronym-question-flow.json"),
	level: path.resolve("data", "level-quiz-question-flow.json"),
	case: path.resolve("data", "case-study-question-flow.json"),
};

export const listAllChapters: (
	quizId: QuizIdType
) => Promise<ChapterInfoType[]> = async (quizId) => {
	try {
		const fileContents = fs.readFileSync(filePath[quizId], "utf8");
		const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
		const chapterInfos = chapters.map((c) => ({
			cid: c.cid,
			tags: c.tags,
			chapterTitle: c.chapterTitle,
			chapterDescription: c.chapterDescription,
			chapterCoverImage: c.chapterCoverImage,
			questionIds: c.pages
				.filter(
					(p) =>
						p.pageType === PageTypes.question &&
						!p.question.skippable
				)
				.map((p) => p.pid),
		}));
		return chapterInfos;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getChapter: (
	quizId: QuizIdType,
	chapterId: string
) => Promise<{ chapter?: ChapterType; nextChapterId?: string }> = async (
	quizId,
	chapterId
) => {
	try {
		const fileContents = fs.readFileSync(filePath[quizId], "utf8");
		const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
		const chapter = chapters.find((c) => c.cid === chapterId);
		if (!chapter) throw new Error("Chapter not found");

		const nextChapterId =
			chapters[chapters.findIndex((c) => c.cid === chapterId) + 1]?.cid;
		return { chapter, nextChapterId };
	} catch (error) {
		console.log(error);
		return { chapter: undefined, nextChapterId: undefined };
	}
};

export const populateUserSession: (
	chapter: ChapterType,
	responses: Response[]
) => ChapterType | undefined = (chapter, responses) => {
	try {
		chapter.pages = chapter.pages.map((p) => {
			const response = responses.find((r) => r.questionId === p.pid);
			if (p.pageType === PageTypes.question)
				return updateQuestionPage(p, response);
			else return p;
		});
		return chapter;
	} catch (error) {
		console.log(error);
	}
};

export const updateQuestionPage: (
	page: QuestionPageType,
	response?: Partial<Response>
) => QuestionPageType = (page, response) => {
	const newPage = page;
	if (
		!response ||
		!response.userAnswer ||
		page.question.questionType !== response.questionType
	) {
		newPage.question.userAnswer = undefined;
		newPage.answeredCorrectly = undefined;
		newPage.completed = false;
		return newPage;
	}

	const correctAnswer = newPage.question.correctAnswer;
	if (
		page.question.questionType === QuestionTypes.MCMA ||
		page.question.questionType === QuestionTypes.MCSA
	) {
		newPage.question.userAnswer = response.userAnswer as Array<string>;
		newPage.answeredCorrectly = Array.isArray(correctAnswer)
			? correctAnswer.sort().join() ===
			  newPage.question.userAnswer.sort().join()
			: undefined;
		newPage.completed = true;
	} else if (page.question.questionType === QuestionTypes.RO) {
		newPage.question.userAnswer = response.userAnswer as Array<string>;
		newPage.answeredCorrectly = Array.isArray(correctAnswer)
			? correctAnswer.join() === newPage.question.userAnswer.join()
			: undefined;
		newPage.completed = true;
	} else if (
		page.question.questionType === QuestionTypes.VERB ||
		page.question.questionType === QuestionTypes.EMAIL
	) {
		newPage.question.userAnswer = response.userAnswer as string;
		newPage.answeredCorrectly =
			typeof correctAnswer === "string"
				? newPage.question.userAnswer.match(
						new RegExp(correctAnswer, "i")
				  ) !== null
				: undefined;
		newPage.completed = true;
	}
	return newPage;
};
