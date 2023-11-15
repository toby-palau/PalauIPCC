"use server"

import fs from 'fs';
import path from 'path';
import { ChapterType, PageTypes, QuestionFlowType, QuestionTypes } from '@root/@types/shared.types';
import { cookies } from 'next/headers';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const filePath = path.resolve("data", "question-flow.json");

export const getChapter: (chapterId: string) => Promise<{chapter?: ChapterType; nextChapterId?: string}> = async (chapterId) => {
    try {
        const userId = cookies().get("userId")?.value;
        if (!userId) throw new Error('Unauthorized');
        
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
        const chapter = chapters.find(c => c.cid === chapterId);
        if (!chapter) throw new Error('Chapter not found');

        const responses = await prisma.response.findMany({where: {userId}, orderBy: {updatedAt: 'desc'}});
        chapter.pages = chapter.pages.map(p => {
            const response = responses.find(r => r.questionId === p.pid);
            if (
                !response || 
                p.pageType !== PageTypes.question || 
                p.question.questionType !== response.questionType
            ) return p;
            if (p.question.questionType === QuestionTypes.MCMA || 
                p.question.questionType === QuestionTypes.MCSA ||
                p.question.questionType === QuestionTypes.RO    
            ) return { ...p, userAnswer: response.userAnswer as Prisma.JsonArray };
            else if (
                p.question.questionType === QuestionTypes.VERB ||
                p.question.questionType === QuestionTypes.EMAIL
            ) return { ...p, userAnswer: response.userAnswer as string };
            else return p;
        })
        const nextChapterId = chapters[chapters.findIndex(c => c.cid === chapterId) + 1]?.cid;
        return { chapter, nextChapterId};
    } catch (error) {
        console.log(error);
        return {chapter: undefined, nextChapterId: undefined};
    }
}
