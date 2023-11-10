"use server"

import fs from 'fs';
import path from 'path';
import { ChapterType, QuestionFlowType } from '@root/@types/shared.types';

const filePath = path.resolve("data", "question-flow.json");

export const getChapter: (chapterId: string) => ChapterType | undefined = (chapterId) => {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
        const chapter = chapters.find(c => c.cid === chapterId);
        if (!chapter) throw new Error('Chapter not found');
        return chapter;
    } catch (error) {
        console.log(error);
        return;
    }
}
