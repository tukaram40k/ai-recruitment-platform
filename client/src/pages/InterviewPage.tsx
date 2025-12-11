import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
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
      <header className="border-b border-neutral-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/personal-cabinet')}
              className="text-neutral-400 hover:text-black"
            >
              &larr;
            </button>
            <h1 className="text-sm font-medium">Interview</h1>
          </div>
          {isComplete && (
            <span className="text-xs text-neutral-400">
              Complete
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {isStarting ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-neutral-400">Starting interview...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-5">
                  {messages.map((message, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                        message.role === 'user' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {message.role === 'user' ? 'Y' : 'I'}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-xs text-neutral-400 mb-1">
                          {message.role === 'user' ? 'You' : 'Interviewer'}
                        </p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-xs text-neutral-500">
                        I
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-xs text-neutral-400 mb-1">Interviewer</p>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="flex-shrink-0 border-t border-neutral-200 px-6 py-4">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isComplete ? 'Interview completed' : 'Type your response...'}
                    disabled={isLoading || isComplete}
                    className="flex-1 px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-black disabled:bg-neutral-50 disabled:text-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || isComplete || !inputMessage.trim()}
                    className="px-4 py-2 bg-black text-white text-sm hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400"
                  >
                    Send
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
