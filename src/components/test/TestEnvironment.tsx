'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TestEnvironmentProps {
    testId: string;
    title?: string;
    durationMinutes: number;
    warningsAllowed: number;
    questions: any[];
}

export default function TestEnvironment({ testId, title = "MCQ Assessment", durationMinutes, warningsAllowed = 3, questions }: TestEnvironmentProps) {
    const [hasStarted, setHasStarted] = useState(false)
    const [studentEmail, setStudentEmail] = useState('')
    const [studentName, setStudentName] = useState('')
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
    const [warnings, setWarnings] = useState(0)
    const [showWarning, setShowWarning] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const router = useRouter()

    const submitTest = useCallback(async (reason: string = 'Normal Submission') => {
        if (isSubmitted) return;
        setIsSubmitted(true);

        try {
            const response = await fetch('/api/tests/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testId,
                    studentEmail,
                    studentName,
                    answers,
                    warningsIssued: warnings,
                    reason
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Test Submitted successfully!\nReason: ${reason}`);
                router.push(`/test/${testId}/results/${data.resultId}`);
            } else {
                alert('Failed to submit test. Please contact support.');
                router.push('/');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('An error occurred. Please try again.');
            router.push('/');
        }
    }, [answers, isSubmitted, router, testId, studentEmail, warnings])

    // Timer logic
    useEffect(() => {
        // Reset timer if durationMinutes changes, mostly for strict dependency
        setTimeLeft(durationMinutes * 60);
    }, [durationMinutes]);

    useEffect(() => {
        if (!hasStarted || isSubmitted) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    submitTest('Time Expired');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [hasStarted, isSubmitted, submitTest]);

    // Anti-Cheat: Tab switching / Blur detection
    useEffect(() => {
        if (!hasStarted || isSubmitted) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation();
            }
        };

        const handleBlur = () => {
            handleViolation();
        };

        const handleViolation = () => {
            setWarnings(prev => {
                const newWarnings = prev + 1;
                if (newWarnings >= warningsAllowed) {
                    submitTest('Auto-submitted due to excessive tab switching or leaving page');
                    return newWarnings;
                }
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 5000);
                return newWarnings;
            });
        };

        // Disabled Keyboard shortcuts & Right click
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'p'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [hasStarted, isSubmitted, submitTest, warningsAllowed]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentName.trim() || !studentEmail || !studentEmail.includes('@')) {
            alert('Please enter your full name and a valid email address.');
            return;
        }

        setIsChecking(true);
        try {
            const response = await fetch('/api/tests/check-attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, studentEmail })
            });
            const data = await response.json();

            if (!response.ok || !data.allowed) {
                if (data.resultId) {
                    alert(data.error || 'You have already attempted this test. Redirecting to your result...');
                    router.push(`/test/${testId}/results/${data.resultId}`);
                } else {
                    alert(data.error || 'You cannot take this test.');
                    setIsChecking(false);
                }
                return;
            }

            setHasStarted(true);
            // Optional: Attempt fullscreen for anti-cheat
            document.documentElement.requestFullscreen().catch(() => { });
        } catch (error) {
            console.error(error);
            alert('Error verifying attempt. Please try again.');
            setIsChecking(false);
        }
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
                <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-xl border border-slate-200">
                    <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
                    <div className="text-center text-slate-500 mb-8 space-y-1">
                        <p>Duration: <span className="font-bold text-slate-700">{durationMinutes} minutes</span></p>
                        <p>Questions: <span className="font-bold text-slate-700">{questions?.length || 0}</span></p>
                    </div>

                    <form onSubmit={startTest} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full border-slate-300 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none mb-4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Student Email Address</label>
                            <input
                                type="email"
                                required
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border-slate-300 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                            <h4 className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Anti-Cheat Enabled
                            </h4>
                            <p className="text-amber-700 text-xs leading-relaxed">
                                Once started, do not switch tabs, exit fullscreen, or leave the window. You are allowed {warningsAllowed - 1} warnings before auto-submission.
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isChecking}
                            className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-md ${isChecking ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'}`}
                        >
                            {isChecking ? 'Verifying...' : 'Start Assessment'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col select-none">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <h1 className="font-bold text-xl text-slate-800">{title}</h1>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col text-right">
                        <span className="text-sm text-slate-500 font-medium">Time Remaining</span>
                        <div className={`flex items-center gap-2 text-xl font-bold font-mono ${timeLeft < 300 ? 'text-red-500' : 'text-slate-800'}`}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <button
                        onClick={() => submitTest('Manual Submission')}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md shadow-sky-500/20"
                    >
                        <CheckCircle className="w-4 h-4" /> Submit Test
                    </button>
                </div>
            </header>

            {/* Warnings overlay */}
            {showWarning && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-xl z-50 flex flex-col items-center animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 font-bold mb-1">
                        <AlertCircle className="w-5 h-5" />
                        Anti-Cheat Warning
                    </div>
                    <p>Please do not switch tabs or leave the test window.</p>
                    <p className="font-medium mt-1">Warning {warnings} of {warningsAllowed}</p>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-4xl mx-auto w-full p-6 py-8 flex-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                    {questions && questions.length > 0 ? (() => {
                        const q = questions[currentQuestionIndex];
                        return (
                            <div key={q.id} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                                    <span className="text-slate-500 font-medium tracking-wide">Question {currentQuestionIndex + 1} of {questions.length}</span>
                                    <span className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-full text-xs">
                                        {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 mb-6 leading-relaxed">
                                    {q.text}
                                </h3>

                                <div className="space-y-4">
                                    {q.options?.map((opt: any, optIdx: number) => (
                                        <label key={optIdx} className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition-all ${answers[q.id] === opt.text ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                value={opt.text}
                                                checked={answers[q.id] === opt.text}
                                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                className="w-5 h-5 text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                                            />
                                            <span className="text-slate-700 text-lg">{opt.text}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIndex === 0}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Previous
                                    </button>

                                    {currentQuestionIndex < questions.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors bg-sky-50 text-sky-600 hover:bg-sky-100 ring-1 ring-sky-200"
                                        >
                                            Next Question <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => submitTest('Manual Submission')}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Submit Assessment
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })() : (
                        <div className="text-center text-slate-500 py-10">
                            No questions found for this assessment.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
