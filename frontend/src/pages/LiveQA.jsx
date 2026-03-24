/**
 * LiveQA.jsx — Live Q&A Chat Interface with Audio Responses
 * भारत Avatar Platform — India Innovates 2026
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAvatar, askAvatar } from '../api';

const SUGGESTED_QUESTIONS = {
  arjun: [
    'PM Kisan में कितना पैसा मिलता है?',
    'राशन कार्ड कैसे बनाएं?',
    'मुद्रा लोन कैसे मिलेगा?',
    'जन धन खाता कैसे खोलें?',
  ],
  priya: [
    'आयुष्मान भारत साठी कसे नोंदणी करावे?',
    'MGNREGA मध्ये काम कसे मिळेल?',
    'स्वच्छ भारत योजनेचा लाभ कसा घ्यायचा?',
    'लाडकी बहीण योजना काय आहे?',
  ],
  murugan: [
    'உதவித்தொகை எவ்வாறு பெறுவது?',
    'பள்ளி சேர்க்கை எப்போது?',
    'மதிய உணவு திட்டம் பற்றி சொல்லுங்கள்',
    'PM SHRI பள்ளிகள் என்ன?',
  ],
  asha: [
    'জননী সুরক্ষায় কীভাবে নিবন্ধন করবেন?',
    'টিকা কোথায় পাওয়া যাবে?',
    'সুকন্যা সমৃদ্ধি যোজনা কী?',
    'আয়ুষ্মান ভারত কার্ড কীভাবে পাবো?',
  ],
  bharat: [
    'How do I apply for a ration card?',
    'What are the benefits of PM Kisan?',
    'How to open a Jan Dhan account?',
    'Information about Mudra Loan?',
  ],
};

function LiveQA() {
  const { avatarId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState({});

  // Language code for each avatar
  const AVATAR_LANG = {
    arjun: 'hi', priya: 'mr', murugan: 'ta', asha: 'bn', bharat: 'en',
  };

  const handleTranslate = async (msgIdx) => {
    const msg = chat[msgIdx];
    if (!msg || msg.translatedText) return; // already translated
    const srcLang = AVATAR_LANG[avatarId] || 'hi';
    const tgtLang = srcLang === 'en' ? 'hi' : 'en';
    setTranslating(prev => ({ ...prev, [msgIdx]: true }));
    try {
      const res = await fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text, source_lang: srcLang, target_lang: tgtLang }),
      });
      const data = await res.json();
      setChat(prev => {
        const updated = [...prev];
        updated[msgIdx] = { ...updated[msgIdx], translatedText: data.translated_text, translatedLang: tgtLang };
        return updated;
      });
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(prev => ({ ...prev, [msgIdx]: false }));
    }
  };

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const data = await fetchAvatar(avatarId);
        setAvatar(data);
        setChat([{ role: 'avatar', text: data.greeting }]);
      } catch (err) {
        // Fallback
        const fallbacks = {
          arjun: { id: 'arjun', name: 'Arjun', emoji: '👳', color: '#1D9E75', bg_color: '#E1F5EE', region: 'Delhi / UP', lang_label: 'Hindi', greeting: 'नमस्ते! मैं अर्जुन हूं, आपका उत्तर भारत सरकारी सहायक।' },
          priya: { id: 'priya', name: 'Priya', emoji: '👩‍💼', color: '#534AB7', bg_color: '#EEEDFE', region: 'Maharashtra', lang_label: 'Marathi', greeting: 'नमस्कार! मी प्रिया आहे, तुमची महाराष्ट्र नागरी सहाय्यक।' },
          murugan: { id: 'murugan', name: 'Murugan', emoji: '👨‍🏫', color: '#D85A30', bg_color: '#FAECE7', region: 'Tamil Nadu', lang_label: 'Tamil', greeting: 'வணக்கம்! நான் முருகன், உங்கள் தமிழ்நாடு கல்வி உதவியாளர்.' },
          asha: { id: 'asha', name: 'Asha', emoji: '👩‍⚕️', color: '#BA7517', bg_color: '#FAEEDA', region: 'West Bengal', lang_label: 'Bengali', greeting: 'নমস্কার! আমি আশা, আপনার পশ্চিমবঙ্গ স্বাস্থ্য সহকারী।' },
          bharat: { id: 'bharat', name: 'Bharat', emoji: '👨', color: '#1D4ED8', bg_color: '#EFF6FF', region: 'Pan India', lang_label: 'English', greeting: 'Hello! I am Bharat, your national government assistant.' },
        };
        const fb = fallbacks[avatarId];
        if (fb) {
          setAvatar(fb);
          setChat([{ role: 'avatar', text: fb.greeting }]);
        }
      }
    };
    loadAvatar();
  }, [avatarId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleAsk = async (questionText) => {
    const question = questionText || input.trim();
    if (!question || loading) return;

    // Add user message
    setChat((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      // 1. Fetch Text Answer from Ollama (Llama 3.2:3b)
      const textFormData = new FormData();
      textFormData.append('question', question);
      
      const textResponse = await fetch(`/ask_text/${avatarId}`, {
        method: 'POST',
        body: textFormData
      });
      const textData = await textResponse.json();
      const answerText = textData.answer || "I apologize, no answer was generated.";

      // 2. Add Text to UI immediately
      setChat((prev) => [
        ...prev,
        { role: 'avatar', text: answerText, audioUrl: null },
      ]);

      // 3. Synthesize Audio for the answer
      const audioFormData = new FormData();
      audioFormData.append('avatar_id', avatarId);
      audioFormData.append('text', answerText);
      
      const audioResponse = await fetch(`/admin/preview_audio`, {
        method: 'POST',
        body: audioFormData
      });
      
      let audioUrl = null;
      if (audioResponse.ok) {
        const blob = await audioResponse.blob();
        audioUrl = URL.createObjectURL(blob);
        
        // Update UI with Audio
        setChat((prev) => {
          const newChat = [...prev];
          newChat[newChat.length - 1].audioUrl = audioUrl;
          return newChat;
        });
      }

      // Auto-play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      let errorText = `Sorry, I couldn't process your question. Please try again.`;
      if (err.response?.status === 400) {
        errorText = '⚠️ Your question was flagged by the MCC compliance filter.';
      }
      setChat((prev) => [...prev, { role: 'avatar', text: errorText }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  if (!avatar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1D9E75] rounded-full animate-spin" />
      </div>
    );
  }

  const suggestions = SUGGESTED_QUESTIONS[avatarId] || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Hidden audio element for auto-play */}
      <audio ref={audioRef} className="hidden" />

      {/* ═══════════ TOP HEADER BAR ═══════════ */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3 shadow-sm" style={{ backgroundColor: avatar.color }}>
        <button
          id="qa-back-btn"
          onClick={() => navigate(`/avatar/${avatarId}`)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-3xl">{avatar.emoji}</span>
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg">{avatar.name}</h2>
          <p className="text-white/70 text-xs">{avatar.lang_label} · {avatar.region}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 text-sm font-medium">Live</span>
        </div>
      </div>

      {/* ═══════════ AVATAR DISPLAY AREA ═══════════ */}
      <div
        className="flex-shrink-0 flex items-center justify-center py-6"
        style={{ backgroundColor: avatar.bg_color }}
      >
        <div className="text-center">
          <span className={`text-6xl block ${loading ? 'animate-pulse' : ''}`}>{avatar.emoji}</span>
          {loading && (
            <div className="flex justify-center gap-1.5 mt-3">
              <span className="bounce-dot" style={{ backgroundColor: avatar.color }} />
              <span className="bounce-dot" style={{ backgroundColor: avatar.color }} />
              <span className="bounce-dot" style={{ backgroundColor: avatar.color }} />
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ CHAT AREA ═══════════ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-2xl rounded-br-sm text-white'
                  : 'rounded-2xl rounded-bl-sm bg-white border shadow-sm'
              }`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: avatar.color }
                  : { borderColor: avatar.color + '30' }
              }
            >
              <p>{msg.text}</p>
              {msg.translatedText && (
                <p className="mt-2 pt-2 border-t border-gray-200/50 text-xs opacity-80 italic">
                  🌐 {msg.translatedText}
                </p>
              )}
              {msg.audioUrl && (
                <audio
                  controls
                  src={msg.audioUrl}
                  className="mt-2 w-full h-8"
                  style={{ accentColor: avatar.color }}
                />
              )}
              {msg.role === 'avatar' && idx > 0 && !msg.translatedText && (
                <button
                  onClick={() => handleTranslate(idx)}
                  disabled={translating[idx]}
                  className="mt-2 flex items-center gap-1 text-[11px] font-medium opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
                  style={{ color: avatar.color }}
                >
                  {translating[idx] ? (
                    <><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Translating...</>
                  ) : (
                    <><span>🌐</span> Translate to {AVATAR_LANG[avatarId] === 'en' ? 'Hindi' : 'English'}</>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Suggested questions — show only when chat has just greeting */}
        {chat.length === 1 && suggestions.length > 0 && (
          <div className="py-2">
            <p className="text-xs text-gray-400 mb-2 px-1">Suggested questions:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="flex-shrink-0 text-xs px-4 py-2 rounded-full border whitespace-nowrap 
                             transition-all duration-200 hover:shadow-sm active:scale-95"
                  style={{
                    color: avatar.color,
                    borderColor: avatar.color + '40',
                    backgroundColor: avatar.color + '08',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ═══════════ BOTTOM INPUT BAR ═══════════ */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            id="qa-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask ${avatar.name} a question...`}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent 
                       outline-none text-sm disabled:opacity-50"
          />
          <button
            id="qa-send-btn"
            onClick={() => handleAsk()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl text-white transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
            style={{ backgroundColor: avatar.color }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveQA;
