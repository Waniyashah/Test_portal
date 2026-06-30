import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { signToken } from '@/lib/jwt'

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json()

        if (!email || !otp) {
            return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 })
        }

        const query = `*[_type == "user" && email == $email][0]`
        const user = await client.fetch(query, { email })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (user.loginOtp !== otp) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
        }

        // Clear OTP and mark email as verified
        await client
            .patch(user._id)
            .set({ isVerified: true })
            .unset(['loginOtp'])
            .commit()

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
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
