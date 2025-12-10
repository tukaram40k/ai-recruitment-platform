import React from 'react'

const LoginSelector: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="text-base font-medium tracking-tight">RecruitAI</a>
          <h1 className="text-xl font-normal mt-6">Choose your role</h1>
        </div>

        <div className="space-y-3">
          <a
            href="/login/candidate"
            className="block p-5 border border-neutral-200 hover:border-black group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium">Candidate</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Practice interviews and get feedback</p>
              </div>
              <span className="text-neutral-300 group-hover:text-black">&rarr;</span>
            </div>
          </a>

          <a
            href="/login/recruiter"
            className="block p-5 border border-neutral-200 hover:border-black group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium">Recruiter</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Review candidates and assessments</p>
              </div>
              <span className="text-neutral-300 group-hover:text-black">&rarr;</span>
            </div>
          </a>
        </div>

        <div className="mt-10 text-center">
          <a href="/" className="text-xs text-neutral-400 hover:text-neutral-600">
            &larr; Back to home
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginSelector
