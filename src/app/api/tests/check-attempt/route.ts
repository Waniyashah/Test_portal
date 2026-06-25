import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { testId, studentEmail } = body;

        if (!testId || !studentEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if a result already exists for this test and email
        const query = `*[_type == "result" && test._ref == $testId && studentEmail == $studentEmail][0] { _id }`;
        const existingResult = await client.fetch(query, { testId, studentEmail });

        if (existingResult) {
            return NextResponse.json({
                allowed: false,
                resultId: existingResult._id,
                error: 'You have already attempted this test. Redirecting to your result...'
            });
        }

        return NextResponse.json({ allowed: true });
    } catch (error) {
        console.error('Check Attempt Error:', error);
        return NextResponse.json({ error: 'Failed to verify attempt status' }, { status: 500 });
    }
}
