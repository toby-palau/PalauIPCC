"use server"

import { BarChart } from "@root/components/Dashboard/BarChart";
import { ChapterBreakdown } from "@root/components/Dashboard/ChapterBreakdown";
import { WorldMap } from "@root/components/Dashboard/WorldMap";
import { getAllQuestionStats, getResponseCountsByDate, getUserCount, getUserCountByCountry } from "@root/services/DatabaseService";
import { listAllChapters } from "@root/services/QuestionFlowService";

const Page = async ({searchParams}: {searchParams: {randomSeed: string}}) => {
    console.log(`rerender with random seed ${searchParams.randomSeed}`);
    const userCount = await getUserCount();

    const responseCountsByDate = await getResponseCountsByDate();
    if (!responseCountsByDate) return null;

    const countries = await getUserCountByCountry();
    if (!countries) return null;

    const questions = await getAllQuestionStats();
    if (!questions) return null;

    const chapters = await listAllChapters();
    const chapterStats = chapters.map(c => {
        const filteredQuestions = questions.filter(q => c.questionIds.includes(q.questionId));
        const stats = filteredQuestions.reduce((acc, q) => ({
            started: Math.max(acc.started, q.response_count),
            finished: filteredQuestions.length < c.questionIds.length ? 0 : acc.finished > 0 ? Math.min(acc.finished, q.response_count) : q.response_count,
            answeredCorrectly: acc.answeredCorrectly + q.true_count,
            totalResponses: acc.totalResponses + q.response_count,
        }), {
            started: 0,
            finished: 0,
            answeredCorrectly: 0,
            totalResponses: 0,
        });
        return ({
            cid: c.cid,
            chapterTitle: c.chapterTitle,
            questions: filteredQuestions,
            ...stats,
        })
    });

    return (
        <div className="min-h-screen w-screen md:p-10 p-2 bg-white-dark">
            <div className="flex flex-row justify-end items-center">
                <a href={`/hidden-dashboard?randomSeed=${Math.random()}`} className="m-2 p-2 text-blue-dark text-1xl border border-blue-dark rounded">Refresh</a>
            </div>

            <div className="grid grid-cols-3 gap-4 auto-rows-max">
                
                <div className="md:col-span-1 col-span-3 bg-white p-2 h-96 overflow-scroll text-black">
                    <div className="h-full w-full flex flex-col justify-center items-center">
                        <h1 className="text-lg">Total Visitors</h1>
                        <p className={`text-8xl`}>{userCount}</p>
                    </div>
                </div>
                
                <div className="md:col-span-2 col-span-3 bg-white p-2 h-96 overflow-scroll text-black">
                    <div className="h-full w-full flex flex-col justify-center items-center">
                        <h1 className="text-center text-lg">Response count last 7 days</h1>
                        <BarChart data={responseCountsByDate.map(c => ({...c, date: c.date.toLocaleDateString("en-US", {day: "numeric", month: "short"})}))} />
                    </div>
                </div>
                
                <div className="col-span-3 bg-white p-2 h-96 overflow-scroll text-black">
                    <WorldMap data={countries.map(c => ({id: c.country, value: c.count}))} />
                </div>

                <div className="col-span-3 bg-white p-2 h-96 overflow-scroll text-black flex flex-col justify-start items-center">
                    <h1 className="text-center text-lg mb-4">Chapters overview</h1>
                    <ChapterBreakdown chapterStats={chapterStats} />
                </div>
            </div>
        </div>
    )
}

export default Page;