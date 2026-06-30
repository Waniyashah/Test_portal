'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, FileText, AlertCircle, CheckCircle, Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardData {
    subscription: {
        planName: string
        status: string
    } | null
    testsCount: number
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

export default function UserDashboard() {
    const { user, isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            router.push('/sign-in')
            return
        }

        const name = user.firstName
            ? `${user.firstName} ${user.lastName ?? ''}`.trim()
            : user.emailAddresses[0]?.emailAddress ?? user.id
        const email = user.emailAddresses[0]?.emailAddress ?? ''

        const params = new URLSearchParams({ name, email })
        fetch(`/api/user-data?${params.toString()}`, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load user data')
                return res.json()
            })
            .then(json => {
                setData({ subscription: json.subscription ?? null, testsCount: json.testsCount ?? 0 })
            })
            .catch(err => {
                console.error(err)
                setError('Could not load your data. Please refresh.')
            })
            .finally(() => setLoading(false))
    }, [isLoaded, isSignedIn, user, router])

    const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName ?? ''}`.trim()
        : user?.emailAddresses[0]?.emailAddress ?? 'User'

    const hasSubscription = !!data?.subscription
    const isApproved = data?.subscription?.status === 'Approved'
    const isPending = data?.subscription?.status === 'Pending Approval'
    const isRejected = data?.subscription?.status === 'Rejected'

    // While Clerk is loading, show a full-screen spinner
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <Link href="/" className="flex items-center gap-2 text-sky-600 font-bold text-lg">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center text-sm">T</div>
                        TestPortal
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/dashboard/my-tests" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <FileText className="w-5 h-5" /> My Tests
                    </Link>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-50 shadow-lg">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs font-bold text-sky-600">
                    <LayoutDashboard className="w-5 h-5 animate-pulse" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/my-tests" className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-sky-600">
                    <FileText className="w-5 h-5" />
                    <span>My Tests</span>
                </Link>
            </nav>

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 shrink-0">
                    <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate mr-2">My Profile Dashboard</h1>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="font-medium text-slate-700 max-w-[100px] sm:max-w-xs truncate hidden sm:block" title={displayName}>
                            {displayName}
                        </span>
                        <UserButton />
                    </div>
                </header>

                <div className="p-6 pb-24 md:pb-10 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Welcome, {displayName}! 👋</h2>
                            <p className="text-slate-500 mt-1">Ready to create or manage your exams?</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[0, 1].map(i => (
                                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-48 animate-pulse flex flex-col gap-4">
                                    <div className="h-5 bg-slate-100 rounded w-1/3" />
                                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Account Status Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Account Status</h3>

                                    {hasSubscription ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Current Plan:</span>
                                                <span className="font-bold text-sky-600">{data?.subscription?.planName}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Payment Status:</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isApproved ? 'bg-emerald-100 text-emerald-700' :
                                                        isPending ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {isApproved && <CheckCircle className="w-3 h-3" />}
                                                    {isPending && <ClockIcon className="w-3 h-3" />}
                                                    {isRejected && <AlertCircle className="w-3 h-3" />}
                                                    {data?.subscription?.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Tests Created:</span>
                                                <span className="font-bold text-slate-800">{data?.testsCount}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 italic">No creator subscription detected.</div>
                                    )}
                                </div>
                            </div>

                            {/* Create Tests Card */}
                            <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl p-6 shadow-lg shadow-sky-500/20 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-2">Launch an Exam</h3>

                                {!hasSubscription ? (
                                    <>
                                        <p className="text-sky-100 mb-6">Upgrade your account to create automated, anti-cheat enabled MCQ testing environments.</p>
                                        <Link href="/pricing" className="bg-white text-sky-600 w-fit px-6 py-3 rounded-lg font-bold hover:bg-sky-50 transition-colors flex items-center gap-2">
                                            <Plus className="w-5 h-5" /> Subscribe to Create Tests
                                        </Link>
                                    </>
                                ) : isPending ? (
                                    <>
                                        <p className="text-sky-100 mb-6">Your account is awaiting admin approval. You will be able to create tests once your payment is verified.</p>
                                        <button disabled className="bg-sky-400/50 text-white cursor-not-allowed w-fit px-6 py-3 rounded-lg font-bold flex items-center gap-2">
                                            <ClockIcon className="w-5 h-5" /> Awaiting Verification
                                        </button>
                                    </>
                                ) : isApproved ? (
                                    <>
                                        <p className="text-sky-100 mb-6">Your account is fully approved. You can generate tests depending on your tier limits.</p>
                                        <Link href="/test/create" className="bg-white text-sky-600 w-fit px-6 py-3 rounded-lg font-bold hover:bg-sky-50 transition-colors flex items-center gap-2">
                                            <Plus className="w-5 h-5" /> Create New Test
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-red-100 mb-6">Your payment proof was rejected. Please resubmit.</p>
                                        <Link href="/pricing" className="bg-white text-red-600 w-fit px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">
                                            Re-upload Payment
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
