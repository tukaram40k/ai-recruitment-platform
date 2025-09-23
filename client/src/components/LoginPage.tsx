import React from "react"

const LoginPage: React.FC = () => {
  return (
    <div className="px-6 py-20 p-4 min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-4xl font-bold text-white leading-tight">
          You are a ...
        </h2>
      </div>
      {/* Card Container */}
      <div className="min-h-1 flex p-8 items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {/* Candidate Card */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Candidate</h3>
            <p className="text-white/80 mb-6">
              Find your next career opportunity and apply to jobs seamlessly.
            </p>
            <a href="/login/candidate" className="mt-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">
              Log In as Candidate
            </a>
          </div>

          {/* Recruiter Card */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Recruiter</h3>
            <p className="text-white/80 mb-6">
              Discover top talent and manage your hiring process with ease.
            </p>
            <a href="/login/recruiter" className="mt-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">
              Log In as Recruiter
            </a>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 -left-60 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  )
}

export default LoginPage;