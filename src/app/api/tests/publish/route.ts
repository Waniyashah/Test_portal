import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { client } from '@/sanity/client'
import { getOrCreateSanityUser } from '@/lib/user'

export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const clerkUser = await currentUser()
        const email = clerkUser?.emailAddresses[0]?.emailAddress ?? ''
        const name = clerkUser?.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ''}`.trim()
            : email

        const sanityUser = await getOrCreateSanityUser(userId, email, name)
        const teacherId = sanityUser._id

        const body = await request.json()
        const { title, duration, shuffleQuestions, shuffleOptions, showResultsToStudents, antiCheatEnabled, questions } = body

        if (!title || !questions || questions.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify Subscription
        const sub = await client.fetch(`*[_type == "subscription" && teacher._ref == $teacherId] | order(_createdAt desc)[0]`, { teacherId })
        if (!sub || sub.status !== 'Approved') {
            return NextResponse.json({ error: 'Account not approved for creating tests. Please verify your payment.' }, { status: 403 })
        }

        // 1. Create Question Documents first
        const questionRefs = [];
        for (const q of questions) {
            const questionDoc = {
                _type: 'question',
                text: q.text,
                marks: q.marks || 1,
                options: q.options.map((opt: any) => ({
                    text: opt.text,
                    isCorrect: !!opt.isCorrect,
                    _key: Math.random().toString(36).substring(7)
                }))
            };
            const createdQ = await client.create(questionDoc);
            questionRefs.push({
                _key: Math.random().toString(36).substring(7),
                _type: 'reference',
                _ref: createdQ._id
            });
        }

        // 2. Create the Test Document
        const testDoc = {
            _type: 'mcqTest',
            title: title,
            teacher: {
                _type: 'reference',
                _ref: teacherId
            },
            durationOptions: {
                durationMinutes: duration
            },
            settings: {
                shuffleQuestions: shuffleQuestions,
                shuffleOptions: shuffleOptions || false,
                oneQuestionAtATime: true,
                showResultsToStudents: showResultsToStudents !== undefined ? showResultsToStudents : true,
                antiCheatEnabled: antiCheatEnabled !== undefined ? antiCheatEnabled : true,
                defaultMarks: 1
            },
            sections: [
                {
                    _key: 'default_section',
                    sectionTitle: 'Main Section',
                    questions: questionRefs
                }
            ]
        }

        const createdTest = await client.create(testDoc)

        return NextResponse.json({ message: 'Test published successfully', testId: createdTest._id }, { status: 201 })

    } catch (error: any) {
        console.error('Publish Test Error:', error)
        return NextResponse.json({ error: 'An error occurred creating the test' }, { status: 500 })
    }
}
