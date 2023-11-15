"use server"

import { QuestionFlowProvider } from "@root/contexts/QuestionFlowContext";
import { ChapterBackground } from "@root/components/Chapter/ChapterBackground";
import { ChapterHeader } from "@root/components/Chapter/ChapterHeader";
import { ChapterContent } from "@root/components/Chapter/ChapterContent";
import { getChapter } from "./actions";

const Page = async ({params: {chapterId}}: {params: {chapterId: string}}) => {
    const { chapter, nextChapterId } = await getChapter(chapterId);
    if (!chapter) return <div>Chapter not found</div>;

    const backgroundImages = chapter.pages.map(p => (
        <img 
            key={p.pid}
            src={`/images/backgrounds/${p.backgroundImage}`}
            alt="background image"
            className="absolute h-full w-full object-cover brightness-50"
        />
    ));

    return (
        <div className="fixed h-screen w-screen flex-col items-center justify-center overflow-y-scroll">
            <QuestionFlowProvider chapter={chapter} nextChapterId={nextChapterId}>
                <ChapterBackground backgroundImages={backgroundImages} />
                <ChapterHeader />
                <ChapterContent />
            </QuestionFlowProvider>
        </div>
    )
}

export default Page;