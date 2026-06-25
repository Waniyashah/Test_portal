'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Upload, Banknote } from 'lucide-react'

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Navigation */}
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-transparent">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xl">
                        T
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-800">TestPortal</span>
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                    Simple, transparent pricing
                </h1>
                <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">
                    Choose the plan that best fits your needs. Start creating and managing your online examinations today.
                </p>

                {!selectedPlan ? (
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                        {/* Basic Plan */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900">Basic</h3>
                            <p className="text-slate-500 mt-2 h-10">Essential features for getting started.</p>
                            <div className="my-6">
                                <span className="text-5xl font-extrabold text-slate-900">Rs 2,000</span>
                                <span className="text-slate-500 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Create up to 8 Tests / month', 'Standard Support', 'Basic Analytics', 'Standard Anti-Cheat'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <Check className="w-5 h-5 text-sky-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setSelectedPlan('basic')}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-4 rounded-xl font-bold transition-colors mt-auto"
                            >
                                Select Basic
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative text-white transform scale-105 z-10 flex flex-col">
                            <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</span>
                            </div>
                            <h3 className="text-2xl font-bold">Pro</h3>
                            <p className="text-slate-400 mt-2 h-10">Perfect for growing academies.</p>
                            <div className="my-6">
                                <span className="text-5xl font-extrabold">Rs 4,500</span>
                                <span className="text-slate-400 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Create up to 15 Tests / month', 'Priority Support', 'Detailed Analytics & Export', 'Advanced Anti-Cheat'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-sky-400 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setSelectedPlan('pro')}
                                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-sky-500/25 mt-auto"
                            >
                                Select Pro
                            </button>
                        </div>

                        {/* Max Plan */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900">Max</h3>
                            <p className="text-slate-500 mt-2 h-10">For large institutions and power users.</p>
                            <div className="my-6">
                                <span className="text-5xl font-extrabold text-slate-900">Rs 7,000</span>
                                <span className="text-slate-500 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Unlimited Tests', '24/7 Dedicated Support', 'All Platform Features Enabled', 'White Label Options'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <Check className="w-5 h-5 text-sky-500 shrink-0" />
                                        <span className="font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setSelectedPlan('max')}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-4 rounded-xl font-bold transition-colors mt-auto"
                            >
                                Select Max
                            </button>
                        </div>
                    </div>
                ) : (
                    <PaymentForm plan={selectedPlan} onCancel={() => setSelectedPlan(null)} />
                )}
            </main>
        </div>
    )
}

function PaymentForm({ plan, onCancel }: { plan: string, onCancel: () => void }) {
    const [method, setMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash')
    const [file, setFile] = useState<File | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const router = useRouter()

    const getPlanDetails = () => {
        switch (plan) {
            case 'max': return { name: 'Max Plan', price: 'Rs 7,000' }
            case 'pro': return { name: 'Pro Plan', price: 'Rs 4,500' }
            default: return { name: 'Basic Plan', price: 'Rs 2,000' }
        }
    }

    const planDetails = getPlanDetails()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return alert('Please upload a payment screenshot');

        const formData = new FormData()
        formData.append('planName', planDetails.name)
        formData.append('paymentMethod', method)
        formData.append('file', file)

        try {
            const res = await fetch('/api/subscriptions', {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                setSubmitted(true)
                alert('Payment uploaded successfully. Waiting for admin approval.')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 3000)
            } else {
                alert('Failed to upload payment proof. Please try again.')
            }
        } catch (err) {
            alert('Network error')
        }
    }

    if (submitted) {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
                <div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Uploaded</h2>
                <p className="text-slate-600 mb-6">
                    Your payment proof for the {planDetails.name} has been submitted successfully. Waiting for admin approval. Redirecting you to your profile dashboard...
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left mb-20 animate-in fade-in slide-in-from-bottom-8">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Complete Payment</h2>
                    <p className="text-slate-500">You selected the {planDetails.name}</p>
                </div>
                <button onClick={onCancel} className="text-sm font-medium text-sky-600 hover:text-sky-800">Change Plan</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-4">1. Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setMethod('jazzcash')}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${method === 'jazzcash' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="font-bold">JazzCash</div>
                            <div className="text-sm text-slate-500 mt-1">0300-1234567</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMethod('easypaisa')}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${method === 'easypaisa' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="font-bold">Easypaisa</div>
                            <div className="text-sm text-slate-500 mt-1">0345-7654321</div>
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">2. Transfer the Amount</h3>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        Please transfer exactly <strong>{planDetails.price}</strong> to the selected account above. Make sure to take a screenshot of the successful transaction.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-4">3. Upload Payment Screenshot</h3>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-slate-400 mb-3" />
                            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-400">PNG, JPG or JPEG</p>
                            {file && <p className="mt-2 text-sky-600 font-medium">{file.name}</p>}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>
                </div>

                <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/25 transition-all outline-none">
                    Submit Payment Proof
                </button>
            </form>
        </div>
    )
}
