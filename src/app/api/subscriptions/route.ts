import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/sanity/client'
import { verifyToken } from '@/lib/jwt'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value
        let teacherId = null

        if (token) {
            const decoded: any = verifyToken(token)
            if (decoded && decoded.sub) {
                teacherId = decoded.sub
            }
        }

        if (!teacherId) {
            return NextResponse.json({ error: 'Unauthorized: Please log in to subscribe' }, { status: 401 })
        }

        const formData = await request.formData()
        const planName = formData.get('planName') as string
        const paymentMethod = formData.get('paymentMethod') as string
        const file = formData.get('file') as File

        if (!planName || !paymentMethod || !file) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Upload Payment Screenshot to Sanity Assets
        const buffer = Buffer.from(await file.arrayBuffer())
        const asset = await client.assets.upload('image', buffer, {
            filename: file.name,
            contentType: file.type
        })

        // 2. Create the Subscription Document
        const subscriptionDoc = {
            _type: 'subscription',
            teacher: {
                _type: 'reference',
                _ref: teacherId,
            },
            planName,
            paymentMethod,
            paymentProof: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            },
            status: 'Pending Approval',
            submittedAt: new Date().toISOString()
        }

        const result = await client.create(subscriptionDoc)
        return NextResponse.json({ message: 'Subscription request submitted successfully', _id: result._id }, { status: 201 })
    } catch (error: any) {
        console.error('Subscription Endpoint Error:', error)
        return NextResponse.json({ error: 'An error occurred submitting the payment proof.' }, { status: 500 })
    }
}
