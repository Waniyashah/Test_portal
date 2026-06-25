import React from 'react'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
                        <Shield className="w-5 h-5 text-sky-500" />
                        Privacy Center
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8">Last Updated: October 2023</p>

                <div className="space-y-8 prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to TestPortal. We are committed to protecting your personal information and your right to privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you interact with our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Details:</strong> We collect your name, email address, and optionally your role (Student or Teacher) when you register for an account or attempt an examination.</li>
                            <li><strong>Examination Analytics:</strong> When connected to a secure testing environment, we collect answers, scores, submission times, and behavioral metrics (like tab-switching activity) for the purpose of ensuring academic integrity.</li>
                            <li><strong>Payment Proofs:</strong> For subscriptions paid via JazzCash or Easypaisa, we store uploaded receipt screenshots temporarily until an administrator successfully verifies and processes your account upgrade.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                        <p>We strictly utilize your data to operate the TestPortal platform securely. Specifically:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>To authenticate your login and manage access to your Teacher or Student dashboards.</li>
                            <li>To automatically compute, track, and rank examination scores on behalf of the creator.</li>
                            <li>To detect violations of examination rules using browser environment monitoring.</li>
                            <li>To provide customer support and review payment verifications.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Cookies and Web Storage</h2>
                        <p>
                            TestPortal uses essential cookies (such as JSON Web Tokens in HttpOnly cookies) solely for authentication and maintaining your secure sessions. We do not use third-party tracking cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Information Sharing and Disclosure</h2>
                        <p>
                            We do not sell, rent, or trade your personal information. If you are a student, your name, email, examination scores, and behavioral metadata (e.g. anti-cheat warnings) are shared exclusively with the creator (Teacher) of the test you attempt.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Security</h2>
                        <p>
                            Your information is securely stored inside databases powered by Sanity CMS. While we strive to protect your data with commercially acceptable means (encryption, restricted backend queries), no method of transmission over the internet or electronic storage is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
                        <p>
                            If you have questions or comments about this Privacy Policy, you may contact our administrative team via email at support@testportal.app.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
