import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import bcrypt from 'bcryptjs'

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

        // Create Sanity Document
        const doc = {
            _type: 'user',
            name,
            email,
            password: hashedPassword,
            role: 'student', // default role
        }

        // Note: client.create requires a token with write access
        const result = await client.create(doc)

        return NextResponse.json({ message: 'User created successfully', userId: result._id }, { status: 201 })
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'An error occurred during registration.' }, { status: 500 })
    }
}
