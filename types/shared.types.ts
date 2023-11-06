export enum  PageTypes {
    title = "title",
    narrator = "narrator",
    question = "question",
    success = "success",

};

export enum QuestionTypes {
    MCSA = "MCSA",
    MCMA = "MCMA",
    RO = "RO",
    TF = "TF",
    VERB = "VERB"
};

export enum FilterTypes {
    all = "all",
    climateChange = "climateChange",
    planetNews = "planetNews",
    earthsFuture = "earthsFuture",
    carbonFootprint = "carbonFootprint",
};

export const FilterTypeLabels: {[key in FilterTypes]: string} = {
    all: "🌱 All",
    climateChange: "🪸 Climate Change",
    planetNews: "🌍 Planet News",
    earthsFuture: "🔮 The Earth's Future",
    carbonFootprint: "🦶 Carbon Footprint",
};

export type QuestionFlowType = {
	chapters: Array<ChapterType>;
};

export type ChapterType = {
    cid: number;
    tags: Array<FilterTypes>;
    chapterTitle: string;
    chapterDescription: string;
    chapterCoverImage: string;
    pages: Array<TitlePageType | NarratorPageType | QuestionPageType>;
};

export type TitlePageType = {
    pid: number;
    pageType: PageTypes.title;
    title: string;
    subtitle: string;
    backgroundImage: string;
    displayLogic?: DisplayLogicType;
};

export type NarratorPageType = {
    pid: number;
    pageType: PageTypes.narrator;
    avatarImage: string;
    avatarText: string;
    backgroundImage: string;
    displayLogic?: DisplayLogicType;
};

export type QuestionPageType = {
    pid: number;
    pageType: PageTypes.question;
    avatarImage: string;
    backgroundImage: string;
    completed: boolean;
    answeredCorrectly?: boolean;
    question: MCSAQuestionType | MCMAQuestionType | ROQuestionType | VERBQuestionType;
    displayLogic?: DisplayLogicType;
};

export type MCSAQuestionType = {
    questionType: QuestionTypes.MCSA;
    questionText: string;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
    correctAnswer?: Array<number>;
    userAnswer?: Array<number>;
};

export type MCMAQuestionType = {
    questionType: QuestionTypes.MCMA;
    questionText: string;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
    correctAnswer?: Array<number>;
    userAnswer?: Array<number>;
};

export type ROQuestionType = {
    questionType: QuestionTypes.RO;
    questionText: string;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
    correctAnswer?: Array<number>;
    userAnswer?: Array<number>;
};

export type VERBQuestionType = {
    questionType: QuestionTypes.VERB;
    questionText: string;
    correctAnswer?: RegExp;
    userAnswer?: string;
};

type DisplayLogicType = {
    pid: number;
    correct: boolean;
};
