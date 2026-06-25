import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { testId, studentEmail, studentName, answers, warningsIssued, reason } = body

        if (!testId || !studentEmail || !studentName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Prevent duplicate submissions via backend check
        const attemptQuery = `count(*[_type == "result" && test._ref == $testId && studentEmail == $studentEmail])`;
        const attempts = await client.fetch(attemptQuery, { testId, studentEmail });

        if (attempts > 0) {
            return NextResponse.json({ error: 'You have already attempted this test.' }, { status: 403 });
        }

        // Fetch the test with its questions to calculate score
        const query = `*[_type == "mcqTest" && _id == $testId][0] {
            settings,
            "questions": sections[0].questions[]->{
                _id,
                marks,
                options
            }
        }`;

        const testDoc = await client.fetch(query, { testId });
        if (!testDoc) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        const defaultMarks = testDoc.settings?.defaultMarks || 1;
        let totalMarksObtained = 0;
        let maxMarks = 0;

        // Calculate score
        if (testDoc.questions && Array.isArray(testDoc.questions)) {
            for (const q of testDoc.questions) {
                const questionMarks = q.marks !== undefined ? q.marks : defaultMarks;
                maxMarks += questionMarks;

                const studentAnswer = answers[q._id];
                if (studentAnswer) {
                    const option = q.options?.find((o: any) => o.text === studentAnswer);
                    if (option && option.isCorrect) {
                        totalMarksObtained += questionMarks;
                    }
                }
            }
        }
        const percentage = maxMarks > 0 ? (totalMarksObtained / maxMarks) * 100 : 0;

        // Save result
        const resultDoc = {
            _type: 'result',
            test: { _type: 'reference', _ref: testId },
            studentEmail: studentEmail,
            studentName: studentName,
            totalMarksObtained,
            maxMarks,
            percentage: Math.round(percentage * 100) / 100,
            warningsIssued: warningsIssued || 0,
            remarks: reason || 'Normal Submission',
            submittedAt: new Date().toISOString()
        }

        const createdResult = await client.create(resultDoc)

        return NextResponse.json({
            message: 'Test submitted successfully',
            resultId: createdResult._id
        }, { status: 201 })

    } catch (error: any) {
        console.error('Submit Test Error:', error)
        return NextResponse.json({ error: 'An error occurred submitting the test' }, { status: 500 })
    }
}
