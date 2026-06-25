import React from 'react'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <FileText className="w-5 h-5 text-sky-500" />
                        Terms & Conditions
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms and Conditions</h1>
                <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8">Last Updated: October 2023</p>

                <div className="space-y-8 prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By creating an account, accessing the dashboard, or taking an examination on TestPortal, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Account Responsibilities</h2>
                        <p>
                            You must provide accurate information when registering (both Teachers and Students). You are responsible for safeguarding your login credentials. Teachers are completely responsible for the contents and legitimacy of examinations hosted beneath their account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Subscriptions and Approval Policy</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Test creation is currently limited to accounts possessing an active Teacher Subscription.</li>
                            <li>Payments are to be made manually via JazzCash or Easypaisa, followed by uploading the transaction proof screenshot on the Pricing selection page.</li>
                            <li>Submitted payment proofs are manually reviewed by administrators. Unverified, fake, or illegible proofs will be strictly rejected.</li>
                            <li>Due to the nature of our cloud-hosted services, all successfully verified payments are non-refundable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Anti-Cheat & Examination Integrity</h2>
                        <p>
                            As a student taking a test, you consent to automated behavioral monitoring designed strictly to prevent cheating (e.g., detecting if you switch browser tabs or alter the DOM). Exceeding the maximum allowed warnings placed by the Teacher will trigger automatic submission of your examination, and appeals must be directed solely toward the creator of the test, rather than TestPortal's administrative team.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Acceptable Use Policy</h2>
                        <p>You agree NOT to engage in any of the following prohibited activities:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Attempting to bypass, disable, reverse-engineer, or otherwise interfere with security-related features.</li>
                            <li>Using the platform to distribute spam or malicious scripts.</li>
                            <li>Creating tests containing universally offensive, inappropriate, or illegal content.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
                        <p>
                            TestPortal provides the SaaS application "as is" and without warranties. In no event shall our developers or administrators be liable for technical errors resulting in unrecorded scores, loss of data, or disruptions of service, nor are we liable for decisions graded or enforced by third-party instructors utilizing our environment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users of substantial changes by updating the policy on this page. Your continued use of the platform following the changes constitutes your acceptance of the revised Terms.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
