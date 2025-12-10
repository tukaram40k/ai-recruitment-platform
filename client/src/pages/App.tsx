import React from 'react'
import { ArrowRight } from 'lucide-react'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-lg font-medium text-black">RecruitAI</span>
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Sign in
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6">
        <div className="py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-light text-black leading-tight mb-6">
            AI-powered interviews<br />
            for modern hiring
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mb-10">
            Streamline your recruitment process with intelligent interview simulation.
            Get objective assessments and find the right candidates faster.
          </p>
          <div className="flex gap-4">
            <a
              href="/login/candidate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Start as Candidate
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/login/recruiter"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium hover:border-black transition-colors"
            >
              Recruiter Portal
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-gray-200 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">01</p>
              <h3 className="text-lg font-medium text-black mb-2">Smart Interviews</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI conducts natural conversations, asking relevant follow-up questions based on candidate responses.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">02</p>
              <h3 className="text-lg font-medium text-black mb-2">Objective Scoring</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get consistent evaluations across skills, communication, culture fit, and motivation.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">03</p>
              <h3 className="text-lg font-medium text-black mb-2">Detailed Reports</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access full transcripts, strengths, concerns, and hiring recommendations for every interview.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-200 py-16">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-light text-black">5 min</p>
              <p className="text-sm text-gray-500 mt-2">Average interview time</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-light text-black">85%</p>
              <p className="text-sm text-gray-500 mt-2">Time saved on screening</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-light text-black">24/7</p>
              <p className="text-sm text-gray-500 mt-2">Available anytime</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-gray-200 py-16 text-center">
          <h2 className="text-2xl font-light text-black mb-4">Ready to transform your hiring?</h2>
          <p className="text-gray-600 mb-8">Start your first AI interview in minutes.</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
          <span className="text-sm text-gray-500">RecruitAI</span>
          <span className="text-sm text-gray-500">AI Interview Platform</span>
        </div>
      </footer>
    </div>
  )
}

export default App
