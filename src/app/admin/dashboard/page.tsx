import React from 'react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { client } from '@/sanity/client'
import { Shield, Activity, Users, CreditCard, Check, X, FileText, Trash2 } from 'lucide-react'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'

// Check Admin Access
async function checkAdminAccess() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return false
    try {
        const decoded: any = verifyToken(token)
        const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
        const allowedAdmins = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());

        if (decoded && decoded.email && allowedAdmins.includes(decoded.email.toLowerCase())) {
            return true
        }
    } catch (e) { }
    return false
}

// Fetch real data from Sanity via GROQ
async function fetchSubscriptions() {
    const query = `*[_type == "subscription"] | order(_createdAt desc) {
    _id,
    planName,
    paymentMethod,
    status,
    _createdAt,
    "user": teacher->{name, email, _id},
    "paymentProof": paymentProof.asset->url
  }`

    // Set fetch cache to "no-store" for real-time dashboard data updates without refresh issues
    return await client.fetch(query, {}, { cache: 'no-store' })
}

async function fetchStats() {
    const usersCount = await client.fetch(`count(*[_type == "user"])`, {}, { cache: 'no-store' })
    const pendingCount = await client.fetch(`count(*[_type == "subscription" && status == "Pending Approval"])`, {}, { cache: 'no-store' })
    const activeSubs = await client.fetch(`count(*[_type == "subscription" && status == "Approved"])`, {}, { cache: 'no-store' })

    return { usersCount, pendingCount, activeSubs }
}

export default async function AdminDashboard() {
    const isAdmin = await checkAdminAccess()
    if (!isAdmin) {
        redirect('/') // Redirect non-admins to homepage
    }

    const subscriptions = await fetchSubscriptions()
    const stats = await fetchStats()

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Shield className="w-6 h-6 text-sky-500" />
                        Admin Panel
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 bg-sky-900/50 text-sky-400 rounded-lg font-medium">
                        <Users className="w-5 h-5" /> Subscriptions & Users
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-lg font-medium transition-colors">
                        <Activity className="w-5 h-5 text-slate-400" /> Platform Stats
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 lg:px-10">
                    <h1 className="text-xl font-bold text-white">User Subscriptions Review</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">Admin Access</div>
                        <button className="text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Logout
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl">
                            <div className="text-slate-400 font-medium mb-2">Total Registered Users</div>
                            <div className="text-4xl font-bold text-white">{stats.usersCount || 0}</div>
                        </div>
                        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                            <div className="text-sky-300 font-medium mb-2">Pending Plan Approvals</div>
                            <div className="text-4xl font-bold text-sky-400">{stats.pendingCount || 0}</div>
                            <div className="absolute -right-4 -bottom-4 bg-sky-500/10 w-24 h-24 rounded-full blur-2xl"></div>
                        </div>
                        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl">
                            <div className="text-slate-400 font-medium mb-2">Total Active Subscriptions</div>
                            <div className="text-4xl font-bold text-emerald-400">{stats.activeSubs || 0}</div>
                        </div>
                    </div>

                    {/* User Management Table */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-sky-400" />
                                User Pricing Plans & Approvals
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {subscriptions.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No subscriptions found yet in the database.</div>
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-900 text-slate-400 font-medium">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-slate-800">User Info</th>
                                            <th className="px-6 py-4 border-b border-slate-800">Plan Bought</th>
                                            <th className="px-6 py-4 border-b border-slate-800">Payment Status</th>
                                            <th className="px-6 py-4 border-b border-slate-800">Payment Proof</th>
                                            <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-slate-300">
                                        {subscriptions.map((sub: any) => (
                                            <tr key={sub._id} className="hover:bg-slate-900/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium">{sub.user?.name || 'Unknown User'}</div>
                                                    <div className="text-slate-500 text-xs mt-1">{sub.user?.email || 'No email provided'}</div>
                                                    <div className="text-slate-600 text-xs mt-1">Submitted: {new Date(sub._createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md font-medium text-xs border ${sub.planName === 'Max' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        sub.planName === 'Pro' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                                            'bg-slate-800 text-slate-300 border-slate-700'
                                                        }`}>
                                                        {sub.planName || 'Basic Plan'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {sub.status === 'Approved' && <><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <span className="text-emerald-400">Approved</span></>}
                                                        {sub.status === 'Pending Approval' && <><span className="w-2 h-2 rounded-full bg-yellow-500"></span> <span className="text-yellow-400">Pending Review</span></>}
                                                        {sub.status === 'Rejected' && <><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="text-red-400">Rejected</span></>}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">Method: {sub.paymentMethod}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {sub.paymentProof ? (
                                                        <a href={sub.paymentProof} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-xs font-medium">
                                                            <FileText className="w-4 h-4" /> View Image
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-500 text-xs">No Image</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <form action={async () => {
                                                            'use server';
                                                            await client.patch(sub._id).set({ status: 'Approved' }).commit()
                                                            revalidatePath('/admin/dashboard')
                                                        }}>
                                                            <button type="submit" className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Approve Plan">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                        <form action={async () => {
                                                            'use server';
                                                            await client.patch(sub._id).set({ status: 'Rejected' }).commit()
                                                            revalidatePath('/admin/dashboard')
                                                        }}>
                                                            <button type="submit" className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Reject Plan">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                        <form action={async () => {
                                                            'use server';
                                                            await client.delete(sub._id)
                                                            revalidatePath('/admin/dashboard')
                                                        }}>
                                                            <button type="submit" className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Delete Plan">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                    </div>
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
