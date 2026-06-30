import React from 'react'
import Link from 'next/link'
import { Plus, Users, LayoutDashboard, Settings, FileText, BarChart } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

export default async function TeacherDashboard() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-sky-600 font-bold text-lg">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center text-sm">
                            T
                        </div>
                        Teacher Panel
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/teacher/dashboard" className="flex items-center gap-3 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/teacher/tests" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <FileText className="w-5 h-5" /> My Tests
                    </Link>
                    <Link href="/teacher/results" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <BarChart className="w-5 h-5" /> Results
                    </Link>
                    <Link href="/teacher/students" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <Users className="w-5 h-5" /> Students
                    </Link>
                    <Link href="/teacher/settings" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
                    <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
                    <div className="flex items-center gap-4">
                        <UserButton />
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Welcome back, John! 👋</h2>
                            <p className="text-slate-500 mt-1">Here's what's happening with your tests today.</p>
                        </div>
                        <Link href="/teacher/tests/create" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Create New Test
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="text-slate-500 font-medium mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Total Tests
                            </div>
                            <div className="text-4xl font-bold text-slate-900">12</div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="text-slate-500 font-medium mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Active Students
                            </div>
                            <div className="text-4xl font-bold text-slate-900">148</div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="text-slate-500 font-medium mb-2 flex items-center gap-2">
                                <BarChart className="w-4 h-4" /> Avg. Score
                            </div>
                            <div className="text-4xl font-bold text-slate-900">76%</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-slate-900">Recent Tests</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-slate-100">Test Name</th>
                                        <th className="px-6 py-3 border-b border-slate-100">Submissions</th>
                                        <th className="px-6 py-3 border-b border-slate-100">Status</th>
                                        <th className="px-6 py-3 border-b border-slate-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-slate-900">Midterm Physics - Section A</td>
                                        <td className="px-6 py-4 text-slate-600">45 / 50</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href="/teacher/tests/1" className="text-sky-600 hover:text-sky-700 font-medium text-sm">View Details</Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-slate-900">Computer Science Quiz 1</td>
                                        <td className="px-6 py-4 text-slate-600">30 / 30</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">Completed</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href="/teacher/results/2" className="text-sky-600 hover:text-sky-700 font-medium text-sm">Results</Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
