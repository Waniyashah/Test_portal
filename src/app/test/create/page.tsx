'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash, Settings, CheckCircle, ArrowLeft, Save } from 'lucide-react'


export default function CreateTestPage() {
    const router = useRouter()
    const [title, setTitle] = useState('Untitled Test')
    const [duration, setDuration] = useState(30)
    const [shuffleQuestions, setShuffleQuestions] = useState(false)
    const [shuffleOptions, setShuffleOptions] = useState(false)
    const [showResultsToStudents, setShowResultsToStudents] = useState(true)
    const [antiCheatEnabled, setAntiCheatEnabled] = useState(true)
    const [questions, setQuestions] = useState([
        { id: Date.now().toString(), text: '', marks: 1, options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }
    ])

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now().toString(), text: '', marks: 1, options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }
        ])
    }

    const removeQuestion = (id: string) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter(q => q.id !== id))
    }

    const addOption = (questionId: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return { ...q, options: [...q.options, { text: '', isCorrect: false }] }
            }
            return q
        }))
    }

    const removeOption = (questionId: string, optionIndex: number) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.options.length > 2) {
                const newOptions = [...q.options]
                newOptions.splice(optionIndex, 1)
                return { ...q, options: newOptions }
            }
            return q
        }))
    }

    const handleQuestionTextChange = (id: string, text: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, text } : q))
    }

    const handleQuestionMarksChange = (id: string, marks: number) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, marks } : q))
    }



    const handleOptionChange = (questionId: string, optionIndex: number, text: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptions = [...q.options]
                newOptions[optionIndex].text = text
                return { ...q, options: newOptions }
            }
            return q
        }))
    }

    const setCorrectOption = (questionId: string, optionIndex: number) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptions = q.options.map((opt, idx) => ({
                    ...opt,
                    isCorrect: idx === optionIndex
                }))
                return { ...q, options: newOptions }
            }
            return q
        }))
    }

    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            const res = await fetch('/api/tests/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    duration,
                    shuffleQuestions,
                    shuffleOptions,
                    showResultsToStudents,
                    antiCheatEnabled,
                    questions
                })
            })

            const data = await res.json()
            if (!res.ok) {
                alert(data.error || 'Failed to publish test')
                return
            }

            alert(`Test Published successfully!\n\nShare this link with your students:\n${window.location.origin}/test/${data.testId}`)
            router.push('/dashboard')
        } catch (error) {
            console.error('Publish error:', error)
            alert('Something went wrong')
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg sm:text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-sky-500 focus:outline-none px-2 py-1 transition-colors w-full max-w-[200px] sm:max-w-xs"
                    />
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors border border-slate-200 text-sm">
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button onClick={handlePublish} disabled={isPublishing} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                        <Save className="w-4 h-4" /> {isPublishing ? 'Publishing...' : 'Publish Exam'}
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
                {/* Settings Card */}
                <div className="bg-white border-t-8 border-t-sky-500 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Exam Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Duration (Minutes)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none focus:border-sky-500"
                            />
                        </div>
                        <div className="flex flex-col gap-3 pt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={shuffleQuestions}
                                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                                    className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                                />
                                <span className="font-medium text-slate-700">Shuffle Questions</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={shuffleOptions}
                                    onChange={(e) => setShuffleOptions(e.target.checked)}
                                    className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                                />
                                <span className="font-medium text-slate-700">Shuffle Options</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showResultsToStudents}
                                    onChange={(e) => setShowResultsToStudents(e.target.checked)}
                                    className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                                />
                                <span className="font-medium text-slate-700">Show Results Immediately</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={antiCheatEnabled}
                                    onChange={(e) => setAntiCheatEnabled(e.target.checked)}
                                    className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                                />
                                <span className="font-medium text-slate-700">Enable Anti-Cheat Features</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Questions Loop */}
                {questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                    {qIndex + 1}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type your question here"
                                    value={q.text}
                                    onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            // Optional: could focus next field
                                        }
                                    }}
                                    className="flex-1 text-lg font-medium bg-slate-50 hover:bg-slate-100 focus:bg-white border-b-2 border-slate-200 focus:border-sky-500 px-4 py-3 rounded-t-lg transition-colors focus:outline-none"
                                />
                            </div>
                            <div className="ml-12 flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-500">Marks Weight:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={q.marks || 1}
                                    onChange={(e) => handleQuestionMarksChange(q.id, Number(e.target.value))}
                                    className="w-20 px-3 py-1 border border-slate-300 rounded focus:outline-none focus:border-sky-500 text-center font-bold text-sky-700 bg-sky-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pl-12 pr-4">
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-3">
                                    <button
                                        onClick={() => setCorrectOption(q.id, oIndex)}
                                        className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-slate-400'}`}
                                        title="Mark as correct answer"
                                    >
                                        {opt.isCorrect && <CheckCircle className="w-4 h-4" />}
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={opt.text}
                                        onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                if (oIndex === q.options.length - 1) {
                                                    addOption(q.id)
                                                }
                                            }
                                        }}
                                        className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 transition-all ${opt.isCorrect ? 'border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-500' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500'}`}
                                    />
                                    {q.options.length > 2 && (
                                        <button
                                            onClick={() => removeOption(q.id, oIndex)}
                                            className="text-slate-400 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={() => addOption(q.id)}
                                className="mt-3 flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 py-2 border-b border-transparent hover:border-sky-300 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Option
                            </button>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => removeQuestion(q.id)}
                                disabled={questions.length === 1}
                                className="text-slate-500 hover:text-red-600 disabled:opacity-30 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash className="w-4 h-4" /> Delete Question
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-center pt-4 pb-12">
                    <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-full font-bold hover:shadow-md hover:border-sky-300 hover:text-sky-600 transition-all shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" /> Add New Question
                    </button>
                </div>
            </main>
        </div>
    )
}
