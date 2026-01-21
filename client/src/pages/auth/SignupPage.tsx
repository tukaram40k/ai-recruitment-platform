import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/useAuth'

interface SignupPageProps {
  user_role: 'candidate' | 'recruiter'
}

const SignupPage: React.FC<SignupPageProps> = ({ user_role = 'candidate' }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    if (password !== password2) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await register({
        name,
        email,
        password,
        role: user_role === 'recruiter' ? 'ROLE_RECRUITER' : 'ROLE_CANDIDATE'
      })

      if (user_role === 'recruiter') {
        navigate('/personal-cabinet/recruiter')
      } else {
        navigate('/personal-cabinet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <a href="/" className="text-base font-medium tracking-tight">RecruitAI</a>
        </div>

        <h1 className="text-xl font-normal text-center mb-8">
          {user_role === 'recruiter' ? 'Create recruiter account' : 'Create account'}
        </h1>

        {error && (
          <div className="mb-5 p-3 border border-neutral-300 bg-neutral-50 text-sm text-neutral-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">
              {user_role === 'recruiter' ? 'Company / Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'Acme Inc.' : 'John Doe'}
              required
              disabled={isLoading}
              className="w-full px-3 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-black disabled:bg-neutral-50"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user_role === 'recruiter' ? 'hr@company.com' : 'you@example.com'}
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
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <a
            href={user_role === 'recruiter' ? '/login/recruiter' : '/login/candidate'}
            className="text-black underline hover:no-underline"
          >
            Sign in
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

export default SignupPage
