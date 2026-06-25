'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            const data = await res.json()

            if (res.ok) {
                // Automatically attempt login after successful registration so HTTPOnly cookie sets
                const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })

                if (loginRes.ok) {
                    router.push('/dashboard')
                    router.refresh()
                } else {
                    router.push('/login')
                }
            } else {
                setError(data.error || 'Registration failed')
            }
        } catch {
            setError('A network error occurred connecting to the database.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-sky-500/20">
                        T
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-sky-600 hover:text-sky-500 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Full Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="text-sm text-slate-500 leading-relaxed">
                            By registering, you agree to our Terms of Service and Privacy Policy. Once registered, you can start taking tests or upgrade your account to create your own examinations.
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Creating Database Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
