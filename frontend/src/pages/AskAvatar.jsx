import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import AvatarPlayer from '../components/AvatarPlayer'
import { MessageSquare, Send, Mic, Loader2, Bot, User, Sparkles, HelpCircle } from 'lucide-react'

const exampleQuestions = [
  'Who is eligible for PM Kisan scheme?',
  'How to apply for Ayushman Bharat card?',
  'What are the benefits of MGNREGA?',
  'How to register for PM Awas Yojana?',
]

export default function AskAvatar() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleAsk = async (q) => {
    const query = q || question
    if (!query.trim()) return

    const userMsg = { type: 'user', text: query, time: new Date().toLocaleTimeString() }
    setHistory(prev => [...prev, userMsg])
    setQuestion('')
    setLoading(true)

    // Simulate POST /api/rag/ask
    await new Promise(r => setTimeout(r, 2000))

    const answers = {
      default: 'Based on the latest government guidelines, I can help you with information about this scheme. The eligibility criteria and benefits are outlined in the official notification. Please visit your nearest government office or portal for detailed information and to apply.',
    }

    const aiMsg = {
      type: 'ai',
      text: answers.default,
      time: new Date().toLocaleTimeString(),
      videoUrl: null,
    }
    setHistory(prev => [...prev, aiMsg])
    setLoading(false)
  }

  return (
    <div className="min-h-screen gradient-subtle tech-grid">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Ask the Avatar</h1>
              <p className="text-gray-500 text-sm">Ask about government schemes and get AI-powered answers</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Chat history */}
            <div className="glass-card rounded-2xl flex-1 p-6 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 mb-4">
              {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-saffron-50 flex items-center justify-center mb-4">
                    <Bot className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-700">Ask About Government Schemes</h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    Type your question below or click one of the suggested questions to get started.
                  </p>
                </div>
              )}
              {history.map((msg, i) => (
                <div key={i} className={`flex gap-3 animate-fade-in-up ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'ai' && (
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'gradient-primary text-white'
                      : 'glass-card'
                  }`}>
                    <p className={`text-sm leading-relaxed ${msg.type === 'user' ? 'text-white' : 'text-gray-700'}`}>{msg.text}</p>
                    <p className={`text-[10px] mt-1.5 ${msg.type === 'user' ? 'text-white/50' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      Analyzing your question...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="glass-card rounded-2xl p-3 flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-gray-100/50 transition-all btn-press" title="Voice input">
                <Mic className="w-5 h-5 text-gray-400" />
              </button>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Who is eligible for PM Kisan scheme?"
                className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-gray-400"
              />
              <button
                onClick={() => handleAsk()}
                disabled={!question.trim() || loading}
                className="p-2.5 rounded-xl gradient-primary text-white hover:shadow-lg transition-all btn-press disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-saffron-500" />
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {exampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-600 glass-card hover:bg-blue-50/50 hover:text-blue-600 transition-all btn-press"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                <span className="font-medium">Powered by RAG AI Engine</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Responses are generated using government knowledge bases and official scheme documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
