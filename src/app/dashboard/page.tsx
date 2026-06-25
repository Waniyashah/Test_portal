import React from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { client } from '@/sanity/client'
import { LayoutDashboard, FileText, Settings, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

async function getUserData() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null;

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.sub) return null;

    // Fetch the latest subscription status for this user
    const query = `*[_type == "subscription" && teacher._ref == $userId] | order(_createdAt desc)[0]`
    const subscription = await client.fetch(query, { userId: decoded.sub })

    // Also fetch how many tests they created to check limits
    const testsCount = await client.fetch(`count(*[_type == "mcqTest" && teacher._ref == $userId])`, { userId: decoded.sub })

    return { user: decoded, subscription, testsCount }
}

export default async function UserDashboard() {
    const data = await getUserData()

    if (!data) {
        redirect('/login') // Force login
    }

    const { user, subscription, testsCount } = data
    const hasSubscription = !!subscription
    const isApproved = subscription?.status === 'Approved'
    const isPending = subscription?.status === 'Pending Approval'
    const isRejected = subscription?.status === 'Rejected'

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

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
                    <h1 className="text-xl font-bold text-slate-800">My Profile Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-slate-700">{user.name}</span>
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-lg">
                            Sign Out
                        </Link>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Welcome, {user.name}! 👋</h2>
                            <p className="text-slate-500 mt-1">Ready to create or manage your exams?</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Account Status Card */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Account Status</h3>

                                {hasSubscription ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Current Plan:</span>
                                            <span className="font-bold text-sky-600">{subscription.planName}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Payment Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                        ${isApproved ? 'bg-emerald-100 text-emerald-700' :
                                                    isPending ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {isApproved && <CheckCircle className="w-3 h-3" />}
                                                {isPending && <Clock className="w-3 h-3" />}
                                                {isRejected && <AlertCircle className="w-3 h-3" />}
                                                {subscription.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Tests Created:</span>
                                            <span className="font-bold text-slate-800">{testsCount}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-slate-500 italic">No creator subscription detected.</div>
                                )}
                            </div>
                        </div>

                        {/* Create Tests Card Action */}
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
                                        <Clock className="w-5 h-5" /> Awaiting Verification
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
                </div>
            </main>
        </div>
    )
}

function Clock(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
