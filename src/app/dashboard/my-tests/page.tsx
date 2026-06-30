import React from 'react'
import Link from 'next/link'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { client } from '@/sanity/client'
import { LayoutDashboard, FileText, Plus, Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import ToggleResultButton from '@/components/test/ToggleResultButton'
import { getOrCreateSanityUser } from '@/lib/user'

async function getMyTests() {
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
        console.warn('currentUser() failed in getMyTests, using fallback identity:', e)
    }

    const sanityUser = await getOrCreateSanityUser(userId, email, name)
    const teacherId = sanityUser._id

    const query = `*[_type == "mcqTest" && teacher._ref == $teacherId] | order(_createdAt desc) {
        _id,
        title,
        _createdAt,
        settings,
        "questionsCount": count(sections[0].questions),
        "resultsCount": count(*[_type == "result" && test._ref == ^._id])
    }`

    const tests = await client.fetch(query, { teacherId }, { cache: 'no-store' })

    return { user: { id: userId, name }, tests }
}

export default async function MyTestsPage() {
    const data = await getMyTests()

    if (!data) {
        redirect('/sign-in')
    }

    const { user, tests } = data

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
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/dashboard/my-tests" className="flex items-center gap-3 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg font-medium">
                        <FileText className="w-5 h-5" /> My Tests
                    </Link>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-50 shadow-lg">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-sky-600">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/my-tests" className="flex flex-col items-center gap-1 text-xs font-bold text-sky-600">
                    <FileText className="w-5 h-5 animate-pulse" />
                    <span>My Tests</span>
                </Link>
            </nav>

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
                    <h1 className="text-xl font-bold text-slate-800">My Tests</h1>
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-slate-700 hidden sm:block">{user.name}</span>
                        <UserButton />
                    </div>
                </header>

                <div className="p-6 pb-24 md:pb-10 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold text-slate-900">Manage Assessments</h2>
                            <p className="text-slate-500 mt-1">View and control the visibility of your tests</p>
                        </div>
                        <Link href="/test/create" className="shrink-0 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md shadow-sky-500/20">
                            <Plus className="w-5 h-5" /> Create Test
                        </Link>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {!tests || tests.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">You haven&apos;t created any tests yet.</div>
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Test Name</th>
                                            <th className="px-6 py-4">Questions</th>
                                            <th className="px-6 py-4">Created Date</th>
                                            <th className="px-6 py-4">Link</th>
                                            <th className="px-6 py-4 text-center">Results</th>
                                            <th className="px-6 py-4 text-center">Student Results Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {tests.map((test: any) => (
                                            <tr key={test._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {test.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {test.questionsCount || 0}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(test._createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/test/${test._id}`} target="_blank" className="text-sky-500 hover:underline">
                                                        View Form
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/dashboard/my-tests/${test._id}/results`}
                                                        className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs px-3 py-1.5 rounded-full transition-colors"
                                                    >
                                                        <Users className="w-3.5 h-3.5" />
                                                        {test.resultsCount ?? 0} Results
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <ToggleResultButton
                                                        testId={test._id}
                                                        initialStatus={test.settings?.showResultsToStudents ?? true}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
