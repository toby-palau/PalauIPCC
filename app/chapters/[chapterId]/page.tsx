"use server"

import { QuestionFlowProvider } from "@root/app/chapters/[chapterId]/contexts/QuestionFlowContext";
import { ChapterBackground } from "@root/components/Chapter/ChapterBackground";
import { ChapterHeader } from "@root/components/Chapter/ChapterHeader";
import { ChapterContent } from "@root/components/Chapter/ChapterContent";
import { getChapter, populateUserSession } from "@root/services/QuestionFlowService";
import { getUserId } from "@root/services/AuthService";
import { getResponses } from "@root/services/DatabaseService";

const Page = async ({params: {chapterId}}: {params: {chapterId: string}}) => {
    const { chapter, nextChapterId } = await getChapter(chapterId);

    if (!chapter) return <div>Chapter not found</div>;

    const userId = await getUserId();
    if (!userId) return <div>Unauthorized</div>;
    
    const responses = await getResponses(userId);
    if (!responses) return <div>Responses not found</div>;

    const userSession = await populateUserSession(chapter, responses);
    if (!userSession) return <div>Could not populate user session</div>;

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
            <QuestionFlowProvider initialSession={userSession} nextChapterId={nextChapterId} userId={userId}>
                <ChapterBackground backgroundImages={backgroundImages} />
                <ChapterHeader />
                <ChapterContent />
            </QuestionFlowProvider>
        </div>
    )
}

export default Page;