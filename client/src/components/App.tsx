import React from 'react'
import { Brain, Users, Zap, ChevronRight, Github, FileText, BookOpen } from 'lucide-react'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">RecruitAI</span>
          </div>

          <nav className="flex items-center space-x-8">
            <a href="#docs" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
              <span>Docs</span>
            </a>
            <a href="#github" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a href="#blog" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              AI Recruitment
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Platform
                            </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transform your hiring process with cutting-edge AI technology. Find the perfect candidates faster,
              reduce bias, and make data-driven recruitment decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="/login" className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-200 shadow-lg inline-block">
                        <span className="flex items-center space-x-2">
                            <span>Get Started</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
            </a>
            <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-400 hover:text-white transition-all duration-200">
              View Demo
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Matching</h3>
              <p className="text-gray-400">Advanced AI algorithms match candidates with job requirements using natural language processing and machine learning.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Automated Screening</h3>
              <p className="text-gray-400">Streamline your hiring pipeline with intelligent resume parsing and automated candidate screening.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bias Reduction</h3>
              <p className="text-gray-400">Promote fair hiring practices with AI-powered tools designed to minimize unconscious bias in recruitment decisions.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
              <div className="text-gray-400">Faster Screening</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">60%</div>
              <div className="text-gray-400">Better Matches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">10k+</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">99%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to revolutionize your hiring?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using AI to build better teams and create more inclusive workplaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-200">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-400 hover:text-white transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  )
}

export default App