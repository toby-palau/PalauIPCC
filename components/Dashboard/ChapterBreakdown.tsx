"use client"

import { ChapterStatsType } from "@root/@types/shared.types";
import { BreakdownBar } from "./BreakdownBar";
import { useState } from "react";

export const ChapterBreakdown = ({chapterStats}: {chapterStats: Array<ChapterStatsType>}) => {
    const [expandedChapter, setExpandedChapter] = useState<string | undefined>();
    
    const toggleChapter = (chapterId: string) => {
        if (expandedChapter === chapterId) setExpandedChapter(undefined);
        else setExpandedChapter(chapterId);
    }

    return (
        <table className="text-sm">
            <thead className="bg-blue-dark text-white">
                <tr>
                    <th className="p-2 text-left">Chapter Title</th>
                    <th className="p-2 text-left">Chapter completion rate</th>
                    <th className="p-2 text-left">Answered Correctly</th>
                </tr>
            </thead>
            <tbody>
                {chapterStats.map((c, i) => (
                    <>
                        <tr onClick={() => toggleChapter(c.cid)} key={c.cid} className={`${i%2 ? "bg-blue-light" : "bg-white"} cursor-pointer`}>
                            <th className="p-2 text-left">{`${i+1}) ${c.chapterTitle}`}</th>
                            <td className="p-2 text-center">
                                <BreakdownBar ratio={c.finished / c.started} />
                                {c.started > 0 && <p>{`(${c.finished}/${c.started})`}</p>}
                            </td>
                            <td className="p-2 text-center">
                                <BreakdownBar ratio={c.answeredCorrectly / c.totalResponses} />
                                {/* {c.totalResponses > 0 && <p>{`(${c.answeredCorrectly}/${c.totalResponses})`}</p>} */}
                                {c.totalResponses > 0 && <p>{`${Math.round(c.answeredCorrectly / c.totalResponses * 100)}%`}</p>}
                            </td>
                        </tr>
                        {expandedChapter === c.cid && (
                            <table className="m-5 w-full">
                                <tr className="bg-blue-light text-white">
                                    <th className="p-2 text-left">Question ID</th>
                                    <th className="p-2 text-left">Response Count</th>
                                    <th className="p-2 text-left">True Count</th>
                                </tr>
                                { c.questions.map(q => (
                                    <tr key={q.questionId} className="bg-white">
                                        <td className="p-2 text-left">{q.questionId}</td>
                                        <td className="p-2 text-left">{q.response_count}</td>
                                        <td className="p-2 text-left">{q.true_count}</td>
                                    </tr>
                                ))}
                            </table>
                        )}
                    </>
                ))}
            </tbody>
        </table>
    )
}