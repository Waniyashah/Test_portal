import React from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { client } from '@/sanity/client'
import { LayoutDashboard, FileText, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import ToggleResultButton from '@/components/test/ToggleResultButton'

async function getMyTests() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null;

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.sub) return null;

    const query = `*[_type == "mcqTest" && teacher._ref == $userId] | order(_createdAt desc) {
        _id,
        title,
        _createdAt,
        settings,
        "questionsCount": count(sections[0].questions)
    }`

    const tests = await client.fetch(query, { userId: decoded.sub })

    return { user: decoded, tests }
}

export default async function MyTestsPage() {
    const data = await getMyTests()

    if (!data) {
        redirect('/login')
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

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
                    <h1 className="text-xl font-bold text-slate-800">My Tests</h1>
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-slate-700">{user.name}</span>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Manage Assessments</h2>
                            <p className="text-slate-500 mt-1">View and control the visibility of your tests</p>
                        </div>
                        <Link href="/test/create" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md shadow-sky-500/20">
                            <Plus className="w-5 h-5" /> Create Test
                        </Link>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {!tests || tests.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">You haven't created any tests yet.</div>
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Test Name</th>
                                            <th className="px-6 py-4">Questions</th>
                                            <th className="px-6 py-4">Created Date</th>
                                            <th className="px-6 py-4">Link</th>
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
