"use client"

import { QuestionFlowProvider } from "@root/context/QuestionFlowContext";
import { ChapterBackground } from "@root/components/Chapter/ChapterBackground";
import { ChapterHeader } from "@root/components/Chapter/ChapterHeader";
import { ChapterContent } from "@root/components/Chapter/ChapterContent";

const Page = ({params: {chapterId}}: {params: {chapterId: string}}) => {
    return (
        <div className="fixed h-screen w-screen flex-col items-center justify-center overflow-y-scroll">
            <QuestionFlowProvider chapterId={chapterId}>
                <ChapterBackground />
                <ChapterHeader />
                <ChapterContent />
            </QuestionFlowProvider>
        </div>
    )
}

export default Page;