"use server"

import { QuestionFlowProvider } from "@root/contexts/QuestionFlowContext";
import { ChapterBackground } from "@root/components/Chapter/ChapterBackground";
import { ChapterHeader } from "@root/components/Chapter/ChapterHeader";
import { ChapterContent } from "@root/components/Chapter/ChapterContent";
import { getChapter, populateUserSession } from "@root/services/QuestionFlowService";
import { getUserId } from "@root/services/AuthService";
import { getResponses } from "@root/services/DatabaseService";
import { AuthProvider } from "@root/contexts/AuthContext";
import { track } from "@vercel/analytics/server";
import { PageTypes, QuizIdType } from "@root/@types/shared.types";

const Page = async ({params: {quizId, chapterId}}: {params: {quizId: QuizIdType; chapterId: string}}) => {
    const userId = await getUserId();
    if (!userId) return <div>Unauthorized</div>;
    
    const { chapter, nextChapterId } = await getChapter(quizId, chapterId);

    if (!chapter) return <div>Chapter not found</div>;

    
    const responses = await getResponses(quizId, userId);
    if (!responses) return <div>Responses not found</div>;
    if (chapter.pages.filter(c => c.pageType === PageTypes.question && c.completed).length <= 0) track("Start Chapter", {chapterId, chapterTitle: chapter.chapterTitle});

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
                <QuestionFlowProvider quizId={quizId} initialSession={userSession} nextChapterId={nextChapterId}>
                    <ChapterBackground backgroundImages={backgroundImages} />
                    <ChapterHeader quizId={quizId} />
                    <ChapterContent />
                </QuestionFlowProvider>
            </AuthProvider>
        </div>
    )
}

export default Page;