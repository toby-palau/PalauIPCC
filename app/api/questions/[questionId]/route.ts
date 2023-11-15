import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, {params}: {params: {questionId: string}}) {
    try {
        const userId = req.headers.get("userId");
        if (!userId) return new Response('Unauthorized', { status: 401 });

        const questionId = params.questionId;
        const { questionType, userAnswer } = await req.json();

        const response = await prisma.response.create({
            data: {
                userId,
                questionId,
                questionType,
                userAnswer
            }
        });
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}