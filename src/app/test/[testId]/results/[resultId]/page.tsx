import React from 'react'
import { client } from '@/sanity/client'
import Link from 'next/link'
import { CheckCircle, Clock } from 'lucide-react'

export default async function ResultPage({ params }: { params: Promise<{ testId: string; resultId: string }> }) {
    const resolvedParams = await params;
    const { testId, resultId } = resolvedParams;

    const query = `*[_type == "result" && _id == $resultId][0] {
        _id,
        studentEmail,
        totalMarksObtained,
        maxMarks,
        percentage,
        remarks,
        test->{
            title,
            settings
        }
    }`;

    const result = await client.fetch(query, { resultId }, { cache: 'no-store' });

    if (!result) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Result Not Found</h1>
                    <p className="text-slate-500">We couldn't find your result. It may have been removed.</p>
                </div>
            </div>
        )
    }

    const { test, totalMarksObtained, maxMarks, percentage, remarks } = result;
    const showResults = test?.settings?.showResultsToStudents;

    if (!showResults) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-3">Test Submitted Successfully!</h1>
                    <p className="text-slate-500 mb-6">
                        However, your teacher has chosen not to publish the results at this time. You will be able to see your score once they publish it.
                    </p>
                    <Link href="/" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-lg transition-colors inline-block w-full">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full flex flex-col items-center">
                <div className="mb-2 text-sm font-medium text-sky-600 uppercase tracking-wide">
                    {test?.title}
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Your Result</h1>

                <div className="bg-slate-50 border border-slate-100 w-full rounded-xl p-6 mb-6">
                    <div className="text-5xl font-black text-sky-500 mb-2">
                        {percentage}%
                    </div>
                    <div className="text-slate-500 font-medium">
                        Score: {totalMarksObtained} / {maxMarks}
                    </div>
                </div>

                {remarks && remarks !== 'Normal Submission' && (
                    <div className="text-sm bg-amber-50 text-amber-700 p-3 rounded-lg mb-6 w-full border border-amber-200 flex items-start gap-2 text-left">
                        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                        <span><strong>Remarks:</strong> {remarks}</span>
                    </div>
                )}

                <Link href="/" className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-lg transition-colors w-full inline-block shadow-md shadow-sky-500/20">
                    Done
                </Link>
            </div>
        </div>
    )
}
