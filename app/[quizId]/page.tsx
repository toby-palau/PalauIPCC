"use server"

import { ChapterList } from "@root/components/Overview/ChapterList";
import { listAllChapters } from "@root/services/QuestionFlowService";
import { ChapterCard } from "@root/components/Overview/ChapterCard";
import { Disclaimer } from "@root/components/Overview/Disclaimer";
import { getResponses } from "@root/services/DatabaseService";
import { getUserId } from "@root/services/AuthService";
import { ResetProgress } from "@root/components/Overview/ResetProgress";
import { AuthProvider } from "@root/contexts/AuthContext";
import { HighlightedChapter } from "@root/components/Overview/HighlightedChapter";
import { QuizIdType } from "@root/@types/shared.types";


const Page = async ({params: {quizId}}: {params: {quizId: QuizIdType}}) => {
    const userId = await getUserId();
    if (!userId) return <div>Unauthorized</div>;

    const chapters = await listAllChapters(quizId);
    if (chapters.length <= 0) return <div>Chapters not found</div>;


    const responses = await getResponses(quizId, userId);
    if (!responses) return <div>Responses not found</div>;

    const chapterList = chapters.map(c => {
        const filteredResponses = responses.filter(r => c.questionIds.includes(r.questionId));
        const progress = filteredResponses.length / c.questionIds.length;
        const score = filteredResponses.filter(r => r.answeredCorrectly).length / c.questionIds.length;
        return ({
            progress,
            score,
            tags: c.tags,
            component: <ChapterCard quizId={quizId} chapter={c} progress={progress} score={score}/>
        })
    });

    let highlightedChapterIndex = chapterList.findIndex(c => c.progress < 1);
    if (highlightedChapterIndex < 0) highlightedChapterIndex = 0;


    return (
        <AuthProvider userId={userId}>
            <div className="bg-black min-h-screen md:p-16 p-0">
                <HighlightedChapter quizId={quizId} chapter={chapters[highlightedChapterIndex]} />
                <ChapterList chapters={chapterList} withFilters={quizId === "ipcc"} />
                { quizId === "ipcc" && <Disclaimer /> }
                <ResetProgress userId={userId} quizId={quizId}/>
            </div>
        </AuthProvider>
    )
}

export default Page;