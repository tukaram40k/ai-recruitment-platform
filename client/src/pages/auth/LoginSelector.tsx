import React from 'react'
import { ArrowRight } from 'lucide-react'

const LoginSelector: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <a href="/" className="text-lg font-medium text-black">RecruitAI</a>
          <h1 className="text-3xl font-light text-black mt-8">Choose your role</h1>
        </div>

        <div className="space-y-4">
          {/* Candidate */}
          <a
            href="/login/candidate"
            className="block p-6 border border-gray-200 hover:border-black transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-black mb-1">Candidate</h2>
                <p className="text-sm text-gray-500">Practice interviews and get feedback</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
            </div>
          </a>

          {/* Recruiter */}
          <a
            href="/login/recruiter"
            className="block p-6 border border-gray-200 hover:border-black transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-black mb-1">Recruiter</h2>
                <p className="text-sm text-gray-500">Review candidates and assessments</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
            </div>
          </a>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginSelector
