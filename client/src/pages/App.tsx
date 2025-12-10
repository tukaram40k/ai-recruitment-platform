import React from 'react'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-base font-medium tracking-tight">RecruitAI</span>
          <a href="/login" className="text-sm text-neutral-500 hover:text-black">
            Sign in
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <div className="py-20 md:py-28">
          <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-black leading-tight mb-5">
            Interview smarter,<br />hire faster.
          </h1>
          <p className="text-base text-neutral-600 max-w-md mb-8 leading-relaxed">
            AI-powered interview platform for objective candidate assessment and streamlined hiring.
          </p>
          <div className="flex gap-3">
            <a
              href="/login/candidate"
              className="px-5 py-2.5 bg-black text-white text-sm hover:bg-neutral-800"
            >
              Start as Candidate
            </a>
            <a
              href="/login/recruiter"
              className="px-5 py-2.5 border border-neutral-300 text-sm hover:border-black"
            >
              Recruiter Portal
            </a>
          </div>
        </div>

        <div className="border-t border-neutral-200 py-14">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <p className="text-xs text-neutral-400 mb-2">01</p>
              <h3 className="text-sm font-medium mb-1">Smart Interviews</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Natural conversations with relevant follow-ups based on responses.
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-2">02</p>
              <h3 className="text-sm font-medium mb-1">Objective Scoring</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Consistent evaluations across skills, communication, and fit.
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-2">03</p>
              <h3 className="text-sm font-medium mb-1">Detailed Reports</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Full transcripts with strengths, concerns, and recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 py-14">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-normal">5 min</p>
              <p className="text-xs text-neutral-400 mt-1">Avg interview</p>
            </div>
            <div>
              <p className="text-2xl font-normal">85%</p>
              <p className="text-xs text-neutral-400 mt-1">Time saved</p>
            </div>
            <div>
              <p className="text-2xl font-normal">24/7</p>
              <p className="text-xs text-neutral-400 mt-1">Available</p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 py-14 text-center">
          <h2 className="text-xl font-normal mb-3">Ready to start?</h2>
          <p className="text-sm text-neutral-500 mb-6">Begin your first interview in minutes.</p>
          <a
            href="/login"
            className="inline-block px-6 py-2.5 bg-black text-white text-sm hover:bg-neutral-800"
          >
            Get Started
          </a>
        </div>
      </main>

      <footer className="border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <span className="text-xs text-neutral-400">RecruitAI</span>
          <span className="text-xs text-neutral-400">Interview Platform</span>
        </div>
      </footer>
    </div>
  )
}

export default App
