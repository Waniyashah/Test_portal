import Link from 'next/link'
import { ArrowRight, CheckCircle, ShieldCheck, BarChart3, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="font-bold text-xl tracking-tight">TestPortal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">Pricing</Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
          <Link href="/signup" className="text-sm font-medium bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-medium">
          The ultimate scalable testing platform for everyone
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-slate-900">
          Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">MCQ Tests</span>, Simplified.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Sign up to take an exam, or upgrade your account to a Creator plan and instantly host secure, automated assessments for your own students.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="flex items-center gap-2 bg-sky-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-600 hover:-translate-y-1 transition-all shadow-lg shadow-sky-500/25">
            Create an Account <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/pricing" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
            View Creator Plans
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-sky-500" />}
            title="Advanced Anti-Cheat"
            description="Tab switching detection, copy-paste prevention, and automated warning systems keep your tests secure."
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6 text-sky-500" />}
            title="Time Management"
            description="Strict timers, scheduled start/end times, and auto-submission ensure fair examination conditions."
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-sky-500" />}
            title="Instant Analytics"
            description="Automated grading, detailed percentage calculations, and PDF result exports for all your students."
          />
        </div>

      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}
