import fs from 'fs';
import path from 'path';
import { QuestionFlowType } from '@root/@types/shared.types';
import { NextResponse } from 'next/server';

const filePath = path.resolve("data", "question-flow.json");

export async function GET({params}: {params: {chapterId: string}}) {
    console.log({params})
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
        const chapter = chapters.find(c => c.cid === params.chapterId);
        console.log(chapter);
        if (!chapter) return NextResponse.json({ error: 'Chapter not found', status: 404 });
        return NextResponse.json({ data: chapter, status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error reading question flow file', status: 500 });
    }

}
