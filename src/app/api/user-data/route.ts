import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/client'
import { getOrCreateSanityUser } from '@/lib/user'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Read name & email from query params (sent by the client using Clerk's useUser hook)
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name') ?? userId
        const email = searchParams.get('email') ?? ''

        const sanityUser = await getOrCreateSanityUser(userId, email, name)
        const teacherId = sanityUser._id

        const subscription = await client.fetch(
            `*[_type == "subscription" && teacher._ref == $teacherId] | order(_createdAt desc)[0]`,
            { teacherId },
            { cache: 'no-store' }
        )

        const testsCount = await client.fetch(
            `count(*[_type == "mcqTest" && teacher._ref == $teacherId])`,
            { teacherId },
            { cache: 'no-store' }
        )

        return NextResponse.json({ subscription, testsCount, sanityUserId: teacherId })
    } catch (err) {
        console.error('[user-data API] error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
