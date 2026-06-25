import React from 'react'
import TestEnvironment from '@/components/test/TestEnvironment'
import { client } from '@/sanity/client'

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {

    // Await params for Next.js 15+
    const resolvedParams = await params;
    const testId = resolvedParams.testId;

    // Fetch the actual test from Sanity
    const query = `*[_type == "mcqTest" && _id == $testId][0] {
        _id,
        title,
        durationOptions,
        settings,
        "questions": sections[0].questions[]->{
            _id,
            text,
            options
        }
    }`;

    const testDoc = await client.fetch(query, { testId }, { cache: 'no-store' });

    if (!testDoc) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Test Not Found</h1>
                    <p className="text-slate-500">The link you followed is invalid or the test has been removed.</p>
                </div>
            </div>
        );
    }

    const durationMinutes = testDoc.durationOptions?.durationMinutes || 30;

    // Shuffle helper function
    const shuffleArray = <T,>(array: T[]): T[] => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Format questions
    let formattedQuestions = testDoc.questions?.map((q: any) => {
        let options = q.options?.map((o: any) => ({ text: o.text })) || [];

        if (testDoc.settings?.shuffleOptions) {
            options = shuffleArray(options);
        }

        return {
            id: q._id,
            text: q.text,
            options
        };
    }) || [];

    if (testDoc.settings?.shuffleQuestions) {
        formattedQuestions = shuffleArray(formattedQuestions);
    }

    return (
        <TestEnvironment
            testId={testId}
            title={testDoc.title || 'MCQ Assessment'}
            durationMinutes={durationMinutes}
            warningsAllowed={3}
            questions={formattedQuestions}
        />
    )
}
