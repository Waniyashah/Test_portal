import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import bcrypt from 'bcryptjs'
import { sendOTP } from '@/lib/sendEmail'

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if user already exists
        const query = `*[_type == "user" && email == $email][0]`
        const existingUser = await client.fetch(query, { email })

        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Create Sanity Document
        const doc = {
            _type: 'user',
            name,
            email,
            password: hashedPassword,
            role: 'student', // default role
            loginOtp: otp,
            isVerified: false
        }

        const result = await client.create(doc)

        // Send Email
        await sendOTP(email, otp)

        return NextResponse.json({
            message: 'User created successfully. OTP Sent.',
            userId: result._id,
            requireOtp: true,
            email: result.email
        }, { status: 201 })
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'An error occurred during registration.' }, { status: 500 })
    }
}
