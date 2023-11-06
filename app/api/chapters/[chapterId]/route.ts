import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { QuestionFlowType } from '@root/types/shared.types';

const filePath = path.resolve("data", "question-flow.json");

export async function GET(req: NextRequest, { params }: { params: { chapterId: string } }) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { chapters } = JSON.parse(fileContents) as QuestionFlowType;
        const chapter = chapters.find(c => c.cid.toString() === params.chapterId);
        if (!chapter) return NextResponse.json({ error: 'Chapter not found', status: 404 });
        return NextResponse.json({ data: chapter, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading question flow file', status: 500 });
    }
}
