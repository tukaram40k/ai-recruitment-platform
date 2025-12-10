import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Send, User } from 'lucide-react'
import api from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStarting, setIsStarting] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (id) {
      startInterview()
    }
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startInterview = async () => {
    if (!id) return

    setIsStarting(true)
    try {
      const result = await api.startInterview(parseInt(id))
      setMessages([{ role: 'assistant', content: result.interviewer_message }])
      setIsComplete(result.is_complete)
    } catch (error) {
      console.error('Failed to start interview:', error)
    } finally {
      setIsStarting(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading || !id) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await api.sendInterviewMessage(parseInt(id), { message: userMessage })
      setMessages(prev => [...prev, { role: 'assistant', content: response.interviewer_message }])
      setIsComplete(response.is_complete)

      if (response.is_complete) {
        setTimeout(() => {
          navigate(`/interview/${id}/result`)
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 flex-shrink-0">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/personal-cabinet')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-medium text-black">Interview</h1>
          </div>
          {isComplete && (
            <span className="text-sm text-gray-500">
              Complete — redirecting...
            </span>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {isStarting ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Starting interview...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div key={index} className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-black' : 'bg-gray-200'
                      }`}>
                        <User className={`w-4 h-4 ${message.role === 'user' ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-xs text-gray-500 mb-1">
                          {message.role === 'user' ? 'You' : 'Interviewer'}
                        </p>
                        <p className="text-gray-800 leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-xs text-gray-500 mb-1">Interviewer</p>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isComplete ? 'Interview completed' : 'Type your response...'}
                    disabled={isLoading || isComplete}
                    className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || isComplete || !inputMessage.trim()}
                    className="px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterviewPage
