import { type } from "os";

export enum  PageTypes {
    title = "title",
    narrator = "narrator",
    question = "question",
    success = "success",
}

export enum QuestionTypes {
    MCSA = "MCSA",
    MCMA = "MCMA",
    RO = "RO",
    VERB = "VERB",
    EMAIL = "EMAIL",
};

export enum DisplayLogicTypes {
    answeredCorrectly = "answeredCorrectly",
    seenBefore = "seenBefore",
}

export type SessionType = {
	pages: Array<TitlePageType | NarratorPageType | QuestionPageType | SuccessPageType>;
}

export enum FilterTypes {
    all = "all",
    current = "current",
    longTerm = "longTerm",
    nearTerm = "nearTerm"
};

export const FilterTypeLabels: {[key in FilterTypes]: string} = {
    all: "🌱 All",
    current: "🌍 Current Status",
    longTerm: "🔮 Long Term",
    nearTerm: "🕞 Near Term",
};

export type QuestionFlowType = {
	chapters: Array<ChapterType>;
};

export type ChapterType = {
    cid: string;
    tags: Array<FilterTypes>;
    chapterTitle: string;
    chapterDescription: string;
    chapterCoverImage: string;
    pages: Array<TitlePageType | NarratorPageType | QuestionPageType | SuccessPageType>;
};

export type ChapterInfoType = {
    cid: string;
    tags: Array<FilterTypes>;
    chapterTitle: string;
    chapterDescription: string;
    chapterCoverImage: string;
};

type PageType = {
    pid: string;
    backgroundImage: string;
    displayLogic?: DisplayLogicType;
};

export type DisplayLogicType = {
    type: DisplayLogicTypes.answeredCorrectly;
    pid: string;
    correct: boolean;
} | {
    type: DisplayLogicTypes.seenBefore;
    localStorageIndentifier: string;
};


export type TitlePageType = PageType & {
    pageType: PageTypes.title;
    title: string;
    subtitle: string;
};

export type NarratorPageType = PageType & {
    pageType: PageTypes.narrator;
    avatarImage: string;
    avatarText: string;
};

export type QuestionPageType = PageType &  {
    pageType: PageTypes.question;
    avatarImage: string;
    completed: boolean;
    answeredCorrectly?: boolean;
    question: MCSAQuestionType | MCMAQuestionType | ROQuestionType | VERBQuestionType | EMAILQuestionType;
};

export type SuccessPageType = PageType & {
    pageType: PageTypes.success;
    avatarImage: string;
    title: string;
    subtitle: string;
};

type QuestionType = {
    questionTitle?: string;
    questionText: string;
    skippable?: boolean;
}

export type MCSAQuestionType = QuestionType & {
    questionType: QuestionTypes.MCSA;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
    correctAnswer?: Array<number>;
    userAnswer?: Array<number>;
};

export type MCMAQuestionType = QuestionType & {
    questionType: QuestionTypes.MCMA;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
    correctAnswer?: Array<number>;
    userAnswer?: Array<number>;
};

export type ROQuestionType = QuestionType & {
    questionType: QuestionTypes.RO;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
    correctAnswer?: Array<number>;
    userAnswer?: Array<number>;
};

export type VERBQuestionType = QuestionType & {
    questionType: QuestionTypes.VERB;
    correctAnswer?: RegExp;
    userAnswer?: string;
};

export type EMAILQuestionType = QuestionType & {
    questionType: QuestionTypes.EMAIL;
    correctAnswer?: RegExp;
    userAnswer?: string;
};