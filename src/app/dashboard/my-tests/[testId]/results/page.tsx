import React from 'react'
import Link from 'next/link'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { client } from '@/sanity/client'
import { redirect } from 'next/navigation'
import { getOrCreateSanityUser } from '@/lib/user'
import { LayoutDashboard, FileText, ArrowLeft, Trophy, Users, Clock, AlertTriangle } from 'lucide-react'

async function getTestResults(testId: string) {
    const { userId } = await auth()
    if (!userId) return null

    let email = ''
    let name = userId
    try {
        const clerkUser = await currentUser()
        email = clerkUser?.emailAddresses[0]?.emailAddress ?? ''
        name = clerkUser?.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ''}`.trim()
            : email || userId
    } catch (e) {
        console.warn('[results] currentUser() failed, using fallback identity:', e)
    }

    const sanityUser = await getOrCreateSanityUser(userId, email, name)
    const teacherId = sanityUser._id

    // Verify this test belongs to the current teacher
    const test = await client.fetch(
        `*[_type == "mcqTest" && _id == $testId && teacher._ref == $teacherId][0]{ _id, title, settings }`,
        { testId, teacherId },
        { cache: 'no-store' }
    )

    if (!test) return null

    // Fetch all results for this test
    const results = await client.fetch(
        `*[_type == "result" && test._ref == $testId] | order(submittedAt desc) {
            _id,
            studentName,
            studentEmail,
            totalMarksObtained,
            maxMarks,
            percentage,
            warningsIssued,
            remarks,
            submittedAt
        }`,
        { testId },
        { cache: 'no-store' }
    )

    return { user: { name }, test, results }
}

function getGradeColor(percentage: number) {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (percentage >= 60) return 'text-sky-600 bg-sky-50 border-sky-200'
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
}

function getGradeLabel(percentage: number) {
    if (percentage >= 80) return 'A'
    if (percentage >= 60) return 'B'
    if (percentage >= 40) return 'C'
    return 'F'
}

export default async function TestResultsPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params
    const data = await getTestResults(testId)

    if (!data) redirect('/dashboard/my-tests')

    const { user, test, results } = data

    const avgPercentage = results.length > 0
        ? Math.round(results.reduce((sum: number, r: any) => sum + (r.percentage ?? 0), 0) / results.length)
        : 0

    const passed = results.filter((r: any) => (r.percentage ?? 0) >= 50).length

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <Link href="/" className="flex items-center gap-2 text-sky-600 font-bold text-lg">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center text-sm">T</div>
                        TestPortal
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/dashboard/my-tests" className="flex items-center gap-3 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg font-medium">
                        <FileText className="w-5 h-5" /> My Tests
                    </Link>
                </nav>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-50 shadow-lg">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-sky-600">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/my-tests" className="flex flex-col items-center gap-1 text-xs font-bold text-sky-600">
                    <FileText className="w-5 h-5" />
                    <span>My Tests</span>
                </Link>
            </nav>

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/my-tests" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 leading-tight truncate max-w-xs sm:max-w-md">{test.title}</h1>
                            <p className="text-xs text-slate-400">Student Submissions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-700 hidden sm:block">{user.name}</span>
                        <UserButton />
                    </div>
                </header>

                <div className="p-6 pb-24 md:pb-10 lg:p-10 max-w-7xl mx-auto w-full">

                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <Users className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{results.length}</div>
                                <div className="text-sm text-slate-500">Total Submissions</div>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{avgPercentage}%</div>
                                <div className="text-sm text-slate-500">Average Score</div>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-sky-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{passed}/{results.length}</div>
                                <div className="text-sm text-slate-500">Passed (≥50%)</div>
                            </div>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Student Results</h2>
                            <span className="text-sm text-slate-500">{results.length} submission{results.length !== 1 ? 's' : ''}</span>
                        </div>

                        {results.length === 0 ? (
                            <div className="p-16 text-center">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No submissions yet</p>
                                <p className="text-slate-400 text-sm mt-1">Share the test link with your students to start collecting results.</p>
                                <Link
                                    href={`/test/${testId}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 mt-4 text-sky-500 hover:text-sky-600 text-sm font-medium"
                                >
                                    View Test Link →
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">#</th>
                                            <th className="px-6 py-4">Student Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4 text-center">Marks</th>
                                            <th className="px-6 py-4 text-center">Grade</th>
                                            <th className="px-6 py-4 text-center">Warnings</th>
                                            <th className="px-6 py-4">Submission Reason</th>
                                            <th className="px-6 py-4">Submitted At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {results.map((result: any, index: number) => {
                                            const pct = result.percentage ?? 0
                                            return (
                                                <tr key={result._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{index + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                        {result.studentName || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                                        {result.studentEmail || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-bold text-slate-900">
                                                            {result.totalMarksObtained ?? 0}
                                                        </span>
                                                        <span className="text-slate-400 text-xs"> / {result.maxMarks ?? 0}</span>
                                                        <div className="text-xs text-slate-400 mt-0.5">{pct.toFixed(1)}%</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getGradeColor(pct)}`}>
                                                            {getGradeLabel(pct)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {(result.warningsIssued ?? 0) > 0 ? (
                                                            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                                {result.warningsIssued}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 max-w-[180px]">
                                                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md truncate block">
                                                            {result.remarks || 'Submitted manually'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                                                        {result.submittedAt
                                                            ? new Date(result.submittedAt).toLocaleString()
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
