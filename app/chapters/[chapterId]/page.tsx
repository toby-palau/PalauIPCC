"use server"

import { QuestionFlowProvider } from "@root/contexts/QuestionFlowContext";
import { ChapterBackground } from "@root/components/Chapter/ChapterBackground";
import { ChapterHeader } from "@root/components/Chapter/ChapterHeader";
import { ChapterContent } from "@root/components/Chapter/ChapterContent";
import { getChapter, populateUserSession } from "@root/services/QuestionFlowService";
import { getUserId } from "@root/services/AuthService";
import { getResponses } from "@root/services/DatabaseService";
import { AuthProvider } from "@root/contexts/AuthContext";
import { track } from "@vercel/analytics";

const Page = async ({params: {chapterId}}: {params: {chapterId: string}}) => {
    const { chapter, nextChapterId } = await getChapter(chapterId);

    if (!chapter) return <div>Chapter not found</div>;

    const userId = await getUserId();
    if (!userId) return <div>Unauthorized</div>;
    
    const responses = await getResponses(userId);
    if (!responses) return <div>Responses not found</div>;
    if (responses.length <= 0) track("Chapter Start", {chapterId, chapterTitle: chapter.chapterTitle});

    const userSession = populateUserSession(chapter, responses);
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
            <AuthProvider userId={userId}>
                <QuestionFlowProvider initialSession={userSession} nextChapterId={nextChapterId}>
                    <ChapterBackground backgroundImages={backgroundImages} />
                    <ChapterHeader />
                    <ChapterContent />
                </QuestionFlowProvider>
            </AuthProvider>
        </div>
    )
}

export default Page;