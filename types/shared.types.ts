export type SessionType = {
	pages: PageType[];
}

export type PageType = {
    qid: number;
    avatarImage: string;
    avatarText?: string;
    backgroundImage: string;
    question?: QuestionType;
    displayLogic?: {
        qid: number;
        correct: boolean;
    }
};

export type QuestionType = {
    questionText: string;
    completed: boolean;
    correct: Array<number>;
    selection: Array<number>;
    questionType: QuestionTypes;
    options: Array<{
        oid: number;
        optionText: string;
    }>;
}

enum QuestionTypes {
    MCSA = "MCSA",
    MCMA = "MCMA",
    RO = "RO",
    TF = "TF"
}