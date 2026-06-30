import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getOrCreateSanityUser } from '@/lib/user';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clerkUser = await currentUser();
        const email = clerkUser?.emailAddresses[0]?.emailAddress ?? '';
        const name = clerkUser?.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ''}`.trim()
            : email

        const sanityUser = await getOrCreateSanityUser(userId, email, name);
        const teacherId = sanityUser._id;

        const body = await request.json();
        const { testId, showResults } = body;

        if (!testId || typeof showResults !== 'boolean') {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify ownership
        const test = await client.fetch(`*[_type == "mcqTest" && _id == $testId][0]{"teacherId": teacher._ref}`, { testId });
        if (!test || test.teacherId !== teacherId) {
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
