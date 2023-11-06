import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { QuestionFlowType } from '@root/types/shared.types';

const filePath = path.resolve("data", "question-flow.json");

export async function GET(req: NextRequest) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
        const chapterTitles = chapters.map(c => ({
            cid: c.cid, 
            tags: c.tags, 
            chapterTitle: c.chapterTitle, 
            chapterDescription: c.chapterDescription, 
            chapterCoverImage: c.chapterCoverImage
        }));
        return NextResponse.json({ data: chapterTitles, status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Error reading question flow file', status: 500 });
    }
}
