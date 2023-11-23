"use server"

import { BarChart } from "@root/components/Dashboard/BarChart";
import { BreakdownBar } from "@root/components/Dashboard/BreakdownBar";
import { WorldMap } from "@root/components/Dashboard/WorldMap";
import { countryISOMapping } from "@root/data/countryCodeLookup";
import { getAllQuestionStats, getResponseCountsByDate, getUserCount, getUserCountByCountry } from "@root/services/DatabaseService";
import { listAllChapters } from "@root/services/QuestionFlowService";
import { dmsans } from "@root/styles/fonts";

const Page = async () => {
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
        [
            {
                questionId: "qid1",
                response_count: 0,
                true_count: 0,
                false_count: 0,
                ratio: 0,
            },
            {
                questionId: "qid2",
                response_count: 0,
                true_count: 0,
                false_count: 0,
                ratio: 0,
            },
        ]
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
            ...stats,
        })
    });

    return (
        <div className="min-h-screen w-screen md:p-10 p-2 bg-white-dark">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 auto-rows-max">
                <div className="col-span-1 bg-white p-2 h-96 overflow-scroll">
                    <div className="h-full w-full flex flex-col justify-center items-center">
                        <h1>Total Visitors</h1>
                        <p className={`${dmsans.className} text-8xl`}>{userCount}</p>
                    </div>
                </div>
                <div className="md:col-span-2 col-span-1 bg-white p-2 h-96 overflow-scroll">
                    <div className="h-full w-full flex flex-col justify-center items-center">
                        <h1 className="text-center">Response count last 7 days</h1>
                        <BarChart data={responseCountsByDate.map(c => ({...c, date: c.date.toLocaleDateString("en-US", {dateStyle: "short"})}))} />
                    </div>
                </div>
                <div className="md:col-span-2 col-span-1 bg-white p-2 h-96 overflow-scroll">
                    <h1 className="text-center">Chapters overview</h1>
                    <table className="text-sm text-black">
                        <thead className="bg-blue-light">
                            <tr>
                                <th className="p-2">Chapter Title</th>
                                <th className="p-2">Completion rate</th>
                                <th className="p-2">Answered Correctly</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapterStats.map((c, i) => (
                                <tr key={c.cid} className={i%2 ? "bg-blue-light" : "bg-white"}>
                                    <th className="p-2 text-left">{c.chapterTitle}</th>
                                    <td className="p-2 text-center">
                                        <BreakdownBar ratio={c.finished / c.started} />
                                        {c.started > 0 && <p>{`(${c.finished}/${c.started})`}</p>}
                                    </td>
                                    <td className="p-2 text-center">
                                        <BreakdownBar ratio={c.answeredCorrectly / c.totalResponses} />
                                        {c.totalResponses > 0 && <p>{`(${c.answeredCorrectly}/${c.totalResponses})`}</p>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-span-1 bg-white p-2 h-96 overflow-scroll">
                    <WorldMap data={countries.map(c => ({id: countryISOMapping[c.country], value: c.count}))} />
                </div>
            </div>
        </div>
    )
}

export default Page;