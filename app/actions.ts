import { ChapterInfoType, ChapterType, QuestionFlowType } from '@root/@types/shared.types';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve("data", "question-flow.json");

export const listAllSections: () => Promise<ChapterInfoType[]> = async () => {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
        const chapterInfos = chapters.map(c => ({
            cid: c.cid, 
            tags: c.tags, 
            chapterTitle: c.chapterTitle, 
            chapterDescription: c.chapterDescription, 
            chapterCoverImage: c.chapterCoverImage
        }));
        return chapterInfos;
    } catch (error) {
        console.log(error)
        return [];
    }
}
