import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { getOrCreateSanityUser } from '@/lib/user'

// This secret comes from your Clerk Dashboard → Webhooks → Signing Secret
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: Request) {
    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing CLERK_WEBHOOK_SECRET' }, { status: 500 })
    }

    // Get the Svix headers for verification
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Verify the webhook is genuinely from Clerk
    const wh = new Webhook(WEBHOOK_SECRET)
    let event: any

    try {
        event = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err) {
        console.error('Webhook verification failed:', err)
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const { type: eventType, data } = event

    // ── Handle user.created ──────────────────────────────────────────────────
    if (eventType === 'user.created') {
        const clerkId = data.id
        const email = data.email_addresses?.[0]?.email_address ?? ''
        const firstName = data.first_name ?? ''
        const lastName = data.last_name ?? ''
        const name = `${firstName} ${lastName}`.trim() || email

        await getOrCreateSanityUser(clerkId, email, name)
    }

    // ── Handle user.updated ──────────────────────────────────────────────────
    if (eventType === 'user.updated') {
        const clerkId = data.id
        const email = data.email_addresses?.[0]?.email_address ?? ''
        const firstName = data.first_name ?? ''
        const lastName = data.last_name ?? ''
        const name = `${firstName} ${lastName}`.trim() || email

        // Find the Sanity doc for this Clerk user
        const sanityDocId = await client.fetch(
            `*[_type == "user" && clerkId == $clerkId][0]._id`,
            { clerkId }
        )

        if (sanityDocId) {
            await client.patch(sanityDocId).set({ name, email }).commit()
            console.log(`✅ Updated Sanity user for Clerk ID: ${clerkId}`)
        }
    }

    // ── Handle user.deleted ──────────────────────────────────────────────────
    if (eventType === 'user.deleted') {
        const clerkId = data.id

        const sanityDocId = await client.fetch(
            `*[_type == "user" && clerkId == $clerkId][0]._id`,
            { clerkId }
        )

        if (sanityDocId) {
            await client.delete(sanityDocId)
            console.log(`🗑️ Deleted Sanity user for Clerk ID: ${clerkId}`)
        }
    }

    return NextResponse.json({ received: true })
}
