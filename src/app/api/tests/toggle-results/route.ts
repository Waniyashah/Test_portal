import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        if (!decoded || !decoded.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { testId, showResults } = body;

        if (!testId || typeof showResults !== 'boolean') {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify ownership
        const test = await client.fetch(`*[_type == "mcqTest" && _id == $testId][0]{"teacherId": teacher._ref}`, { testId });
        if (!test || test.teacherId !== decoded.sub) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update Sanity
        await client.patch(testId)
            .set({ 'settings.showResultsToStudents': showResults })
            .commit();

        return NextResponse.json({ success: true, showResults }, { status: 200 });

    } catch (error: any) {
        console.error('Toggle Results Error:', error);
        return NextResponse.json({ error: 'An error occurred updating the test' }, { status: 500 });
    }
}
