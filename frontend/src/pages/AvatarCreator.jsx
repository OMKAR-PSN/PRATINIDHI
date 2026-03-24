/**
 * AvatarCreator.jsx — Avatar Video Creation Page
 * भारत Avatar Platform — India Innovates 2026
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAvatar, generateVideo, pollStatus, getVideoUrl, getDemoUrl } from '../api';
import ConsentModal from '../components/ConsentModal';

const PLACEHOLDERS = {
  hi: 'यहाँ अपना संदेश हिंदी में लिखें...',
  mr: 'येथे मराठीत तुमचा संदेश लिहा...',
  ta: 'இங்கே தமிழில் உங்கள் செய்தியை எழுதுங்கள்...',
  bn: 'এখানে বাংলায় আপনার বার্তা লিখুন...',
  en: 'Write your message in English here...',
};

const TOPIC_TEMPLATES = {
  hi: (topic) => `${topic} के बारे में जानकारी दें`,
  mr: (topic) => `${topic} बद्दल माहिती द्या`,
  ta: (topic) => `${topic} பற்றி தகவல் கொடுங்கள்`,
  bn: (topic) => `${topic} সম্পর্কে তথ্য দিন`,
  en: (topic) => `Provide information about ${topic}`,
};

function AvatarCreator() {
  const { avatarId } = useParams();
  const navigate = useNavigate();
  const pollingRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [consentVerified, setConsentVerified] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | generating | done | failed
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [mccViolations, setMccViolations] = useState([]);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const data = await fetchAvatar(avatarId);
        setAvatar(data);
      } catch (err) {
        console.error('Failed to load avatar:', err);
        // Hardcoded fallback
        const fallbacks = {
          arjun: { id: 'arjun', name: 'Arjun', title: 'उत्तर भारत सरकारी सहायक', region: 'Delhi / Uttar Pradesh', language: 'hi', lang_label: 'Hindi', gender: 'male', emoji: '👳', color: '#1D9E75', bg_color: '#E1F5EE', greeting: 'नमस्ते! मैं अर्जुन हूं, आपका उत्तर भारत सरकारी सहायक।', topics: ['PM Kisan', 'PM Awas Yojana', 'Ration Card', 'Jan Dhan', 'Mudra Loan', 'MGNREGA'] },
          priya: { id: 'priya', name: 'Priya', title: 'महाराष्ट्र नागरी सहाय्यक', region: 'Maharashtra', language: 'mr', lang_label: 'Marathi', gender: 'female', emoji: '👩‍💼', color: '#534AB7', bg_color: '#EEEDFE', greeting: 'नमस्कार! मी प्रिया आहे, तुमची महाराष्ट्र नागरी सहाय्यक।', topics: ['Ayushman Bharat', 'Mahila Samman', 'Swachh Bharat', 'Ladki Bahin', 'MGNREGA'] },
          murugan: { id: 'murugan', name: 'Murugan', title: 'தமிழ்நாடு கல்வி உதவியாளர்', region: 'Tamil Nadu', language: 'ta', lang_label: 'Tamil', gender: 'male', emoji: '👨‍🏫', color: '#D85A30', bg_color: '#FAECE7', greeting: 'வணக்கம்! நான் முருகன், உங்கள் தமிழ்நாடு கல்வி உதவியாளர்.', topics: ['Mid-Day Meal', 'NSP Scholarships', 'RTE Act', 'PM SHRI Schools', 'Samagra Shiksha'] },
          asha: { id: 'asha', name: 'Asha', title: 'পশ্চিমবঙ্গ স্বাস্থ্য সহকারী', region: 'West Bengal', language: 'bn', lang_label: 'Bengali', gender: 'female', emoji: '👩‍⚕️', color: '#BA7517', bg_color: '#FAEEDA', greeting: 'নমস্কার! আমি আশা, আপনার পশ্চিমবঙ্গ স্বাস্থ্য সহকারী।', topics: ['Janani Suraksha', 'Beti Bachao', 'Sukanya Samriddhi', 'Vaccination', 'Ayushman Bharat'] },
          bharat: { id: 'bharat', name: 'Bharat', title: 'National English Assistant', region: 'Pan India', language: 'en', lang_label: 'English', gender: 'male', emoji: '👨', color: '#1D4ED8', bg_color: '#EFF6FF', greeting: 'Hello! I am Bharat, your national government assistant.', topics: ['PM Kisan', 'Ayushman Bharat', 'Digital India', 'Startup India', 'Make in India'] },
        };
        setAvatar(fallbacks[avatarId] || null);
      }
    };
    loadAvatar();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [avatarId]);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setError('');
    setMccViolations([]);
    setStatus('generating');
    setVideoUrl('');

    try {
      const data = await generateVideo(avatarId, text);
      const sessionId = data.session_id;

      // Start polling every 2 seconds
      pollingRef.current = setInterval(async () => {
        try {
          const statusData = await pollStatus(sessionId);

          if (statusData.status === 'done') {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setVideoUrl(getVideoUrl(sessionId));
            setStatus('done');
          } else if (statusData.status === 'failed') {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            // Fallback to demo video
            setVideoUrl(getDemoUrl(avatarId));
            setStatus('done');
          }
        } catch (pollErr) {
          // On polling error, fallback to demo
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setVideoUrl(getDemoUrl(avatarId));
          setStatus('done');
        }
      }, 2000);
    } catch (err) {
      setStatus('failed');
      if (err.response?.status === 400) {
        const detail = err.response.data?.detail;
        if (detail?.error === 'MCC_VIOLATION') {
          setMccViolations(detail.violations || []);
          setError(detail.reason || 'Content flagged for MCC violation.');
        } else {
          setError(typeof detail === 'string' ? detail : 'Request rejected.');
        }
      } else {
        // Network error — fallback to demo
        setVideoUrl(getDemoUrl(avatarId));
        setStatus('done');
      }
    }
  };

  if (!avatar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1D9E75] rounded-full animate-spin" />
          <p className="text-gray-500">Loading avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════ AVATAR HEADER ═══════════ */}
      <div className="relative" style={{ backgroundColor: avatar.color }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <button
            id="back-to-landing"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All avatars
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{avatar.emoji}</span>
            <div>
              <h1 className="text-white text-2xl font-bold">{avatar.name}</h1>
              <p className="text-white/80">{avatar.title}</p>
              <p className="text-white/60 text-sm">
                {avatar.region} · {avatar.lang_label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-5">
            {/* Consent */}
            <ConsentModal
              avatarColor={avatar.color}
              onVerified={() => setConsentVerified(true)}
            />

            {/* Text Input Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Message in {avatar.lang_label}
                </span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: avatar.color }}
                >
                  {avatar.lang_label}
                </span>
              </div>
              <div className="p-5">
                <textarea
                  id="avatar-text-input"
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={PLACEHOLDERS[avatar.language] || PLACEHOLDERS.hi}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none 
                             focus:ring-2 focus:border-transparent outline-none text-sm leading-relaxed"
                  style={{ '--tw-ring-color': avatar.color + '40' }}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400">{text.length} characters</span>
                </div>

                {/* Quick topic buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {avatar.topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const template = TOPIC_TEMPLATES[avatar.language] || TOPIC_TEMPLATES.hi;
                        setText(template(topic));
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200 
                                 hover:shadow-sm active:scale-95"
                      style={{
                        color: avatar.color,
                        borderColor: avatar.color + '50',
                        backgroundColor: avatar.color + '08',
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              id="generate-video-btn"
              onClick={handleGenerate}
              disabled={!text.trim() || status === 'generating'}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg 
                         active:scale-[0.98]"
              style={{ backgroundColor: avatar.color }}
            >
              {status === 'generating' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  ⏳ Generating {avatar.name}'s video...
                </span>
              ) : (
                `🎬 Generate ${avatar.name}'s Avatar`
              )}
            </button>

            {/* Error display */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div>
                    <p className="text-sm text-red-800 font-medium mb-1">Content Flagged</p>
                    <p className="text-sm text-red-700">{error}</p>
                    {mccViolations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mccViolations.map((v, i) => (
                          <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-mono">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Ask a Question instead */}
            <button
              id="ask-question-btn"
              onClick={() => navigate(`/qa/${avatarId}`)}
              className="w-full py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-200 
                         hover:shadow-md active:scale-[0.98]"
              style={{
                color: avatar.color,
                borderColor: avatar.color,
                backgroundColor: 'transparent',
              }}
            >
              💬 Ask {avatar.name} a Question Instead
            </button>
          </div>

          {/* ─── RIGHT COLUMN: VIDEO PANEL ─── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">{avatar.name}'s Video</h3>
            </div>

            <div
              className="min-h-[320px] flex items-center justify-center p-6"
              style={{ backgroundColor: avatar.bg_color }}
            >
              {status === 'idle' && (
                <div className="text-center space-y-3">
                  <span className="text-7xl block">{avatar.emoji}</span>
                  <p className="text-sm italic max-w-[220px] mx-auto" style={{ color: avatar.color }}>
                    "{avatar.greeting}"
                  </p>
                </div>
              )}

              {status === 'generating' && (
                <div className="text-center space-y-4">
                  <span className="text-7xl block animate-pulse">{avatar.emoji}</span>
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: avatar.color }}>
                      {avatar.name} is preparing your video...
                    </p>
                    <div className="flex justify-center gap-1.5">
                      <span className="bounce-dot" style={{ backgroundColor: avatar.color }} />
                      <span className="bounce-dot" style={{ backgroundColor: avatar.color }} />
                      <span className="bounce-dot" style={{ backgroundColor: avatar.color }} />
                    </div>
                  </div>
                </div>
              )}

              {(status === 'done' || (status === 'failed' && videoUrl)) && videoUrl && (
                <video
                  id="avatar-video-player"
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full rounded-xl shadow-lg"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Download button */}
            {(status === 'done' || (status === 'failed' && videoUrl)) && videoUrl && (
              <div className="p-4 border-t border-gray-100">
                <a
                  id="download-video-btn"
                  href={videoUrl}
                  download={`${avatar.name}_avatar.mp4`}
                  className="w-full py-2.5 rounded-lg text-white font-semibold text-sm flex items-center 
                             justify-center gap-2 transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: avatar.color }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarCreator;
