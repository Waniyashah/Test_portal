import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

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

        // Generate JWT
        const token = signToken({ sub: user._id, role: user.role, email: user.email, name: user.name })

        const response = NextResponse.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, role: user.role }
        })

        // Set HTTPOnly Cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
