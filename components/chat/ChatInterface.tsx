'use client'

import { useClickPeChat } from '@/hooks/useClickPeChat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, Sparkles, ArrowRight, Zap, ShieldCheck, Calculator } from 'lucide-react'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatInterfaceProps {
  productId: string
  productName: string
  bankName: string
  initialMessages?: any[]
}

export function ChatInterface({ productId, productName, bankName, initialMessages = [] }: ChatInterfaceProps) {
  // 1. Core Chat Logic (Custom Hook)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput, append } = useClickPeChat({
    api: '/api/ai/ask',
    productId,
    initialMessages,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e)
  }

  const handleSuggestionClick = (message: string) => {
    if (!isLoading) {
      append({
        role: 'user',
        content: message
      })
    }
  }

  // Contextual suggestions
  const suggestions = [
    {
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      label: 'Interest Rates',
      question: `What are current interest rates?`,
      desc: "Check APR & fixed rates"
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      label: 'Eligibility',
      question: `Am I eligible for this loan?`,
      desc: "Income & credit score"
    },
    {
      icon: <Calculator className="w-4 h-4 text-blue-500" />,
      label: 'Calculate EMI',
      question: `Calculate EMI for 5 lakhs for 3 years`,
      desc: "Estimate monthly payments"
    }
  ]

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* 2. Glassmorphism Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      {/* 3. Header (Minimalist & Clean) */}
      <div className="relative z-10 px-6 py-4 border-b border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-between shadow-sm flex-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-indigo-500/20 shadow-lg text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">{bankName}</h2>
            <p className="text-xs font-medium text-slate-500">{productName} Assistant</p>
          </div>
        </div>
      </div>

      {/* 4. Message Area */}
      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar pb-32" id="chat-container">
        <div className="px-6 py-6 min-h-full flex flex-col">

          {/* Welcome State (Hero Section) */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4 my-auto">

              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center relative z-10 rotate-3 transition-transform hover:rotate-0">
                  <Bot className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-2xl opacity-10 scale-110"></div>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  How can I help you today?
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  I'm trained on all the details of <span className="font-semibold text-indigo-600">{productName}</span>. Ask me anything!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md px-4">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.question)}
                    className={`group relative p-4 rounded-2xl border border-white/60 bg-white/40 hover:bg-white/80 active:scale-[0.98]
                        backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col gap-2
                        ${i === 2 ? 'sm:col-span-2' : ''}
                        `}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 rounded-lg bg-white/50 group-hover:bg-white transition-colors">
                        {s.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 pl-1">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          <div className="space-y-6">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <Avatar className={`w-8 h-8 mt-1 shadow-sm border border-white ${isUser ? 'hidden' : 'block'}`}>
                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`
                            relative px-5 py-3.5 max-w-[85%] text-sm leading-6 shadow-md prose prose-sm max-w-none
                            ${isUser
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm prose-invert'
                        : 'bg-white/80 backdrop-blur-md text-slate-700 rounded-2xl rounded-tl-sm border border-white/50'
                      }
                        `}
                  >
                    {m.content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                          a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-black/10 px-1 py-0.5 rounded text-xs" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : (
                      // Show blinking dots if content is empty (thinking state)
                      <div className="flex gap-1 h-6 items-center">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 text-red-600 text-xs py-2 px-4 rounded-full border border-red-100 shadow-sm">
                  ⚠️ Unable to connect. Please try again.
                </div>
              </div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

        </div>
      </div>

      {/* 5. Input Area (Absolute Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-[2rem] p-1.5 flex items-center gap-2 transition-all focus-within:shadow-xl focus-within:bg-white/90 focus-within:scale-[1.01]">
          <Input
            value={input}
            onChange={onInputChange}
            placeholder="Ask anything..."
            className="flex-1 border-none focus-visible:ring-0 shadow-none text-base h-11 bg-transparent placeholder:text-slate-400 px-4 text-slate-800 font-medium"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleSubmit();
                }
              }
            }}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className={`
                h-10 w-10 rounded-full shadow-md transition-all duration-300
                ${input.trim()
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 hover:rotate-12'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
              `}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2 font-medium tracking-wide opacity-70">
          Powered by ClickPe AI • Answers generated for {bankName}
        </p>
      </div>

      {/* Global Animations Style (Optional if not in global css) */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
