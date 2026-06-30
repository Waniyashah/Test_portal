import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import bcrypt from 'bcryptjs'
import { sendOTP } from '@/lib/sendEmail'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
        }

        // Fetch user
        const query = `*[_type == "user" && email == $email][0]`
        const user = await client.fetch(query, { email })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Verify Password
        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Generate a fresh 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Save OTP to DB
        await client
            .patch(user._id)
            .set({ loginOtp: otp })
            .commit()

        // Send OTP via email
        await sendOTP(email, otp)

        return NextResponse.json({
            message: 'OTP sent to your email',
            requireOtp: true,
            email: user.email
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
