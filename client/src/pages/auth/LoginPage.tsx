import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/useAuth'

interface LoginPageProps {
  user_role: 'candidate' | 'recruiter'
}

const LoginPage: React.FC<LoginPageProps> = ({ user_role = 'candidate' }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)
    setError('')

    try {
      await login({ email, password })

      if (user_role === 'recruiter') {
        navigate('/personal-cabinet/recruiter')
      } else {
        navigate('/personal-cabinet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <a href="/" className="text-base font-medium tracking-tight">RecruitAI</a>
        </div>

        <h1 className="text-xl font-normal text-center mb-8">
          {user_role === 'recruiter' ? 'Recruiter Login' : 'Sign in'}
        </h1>

        {error && (
          <div className="mb-5 p-3 border border-neutral-300 bg-neutral-50 text-sm text-neutral-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'corporate@company.com' : 'you@example.com'}
              required
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-black disabled:bg-neutral-50"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-black disabled:bg-neutral-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-black text-white text-sm hover:bg-neutral-800 disabled:bg-neutral-300"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Don't have an account?{' '}
          <a
            href={user_role === 'recruiter' ? '/signup/recruiter' : '/signup/candidate'}
            className="text-black underline hover:no-underline"
          >
            Sign up
          </a>
        </div>

        <div className="mt-4 text-center">
          <a href="/login" className="text-xs text-neutral-400 hover:text-neutral-600">
            &larr; Back to role selection
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
