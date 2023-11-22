"use server"

import { BreakdownBar } from "@root/components/Dashboard/BreakdownBar";
import { WorldMap } from "@root/components/Dashboard/WorldMap";
import { getAllQuestionStats } from "@root/services/DatabaseService";
import { listAllChapters } from "@root/services/QuestionFlowService";

const Page = async () => {
    const questions = await getAllQuestionStats();
    if (!questions) return null;

    const chapters = await listAllChapters();
    const chapterStats = chapters.map(c => {
        const filteredQuestions = questions.filter(q => c.questionIds.includes(q.questionId));
        const stats = filteredQuestions.reduce((acc, q) => ({
            started: acc.started > 0 ? Math.min(acc.started, q.response_count) : q.response_count,
            finished: Math.max(acc.finished, q.response_count),
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
    })

    return (
        <div className="h-screen w-screen p-10 bg-white-dark">
            <div className="grid grid-cols-3 gap-4 auto-rows-max">
                <div className="col-span-2 bg-white p-2">
                    <table className="text-sm">
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
                                    <th className="p-2 text-center">{c.chapterTitle}</th>
                                    <td className="p-2 text-center"><BreakdownBar ratio={c.finished / c.started} /></td>
                                    <td className="p-2 text-center"><BreakdownBar ratio={c.answeredCorrectly / c.totalResponses} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-span-1 bg-white p-2">
                    <WorldMap />
                </div>
            </div>
        </div>
    )
}

export default Page;