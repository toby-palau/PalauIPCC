import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SessionType } from '@root/types/shared.types';

const filePath = path.resolve("./public", "question-flow.json");

export async function GET(req: NextRequest) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { pages } = JSON.parse(fileContents) as SessionType;
        return NextResponse.json({ data: pages, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading question flow file', status: 500 });
    }
}
