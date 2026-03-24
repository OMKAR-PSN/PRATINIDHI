/**
 * AdminBroadcast.jsx — Admin Panel for Broadcasting Avatar Video Messages
 * भारत Avatar Platform — India Innovates 2026
 *
 * Flow: Admin types Hindi message → TTS → Wav2Lip → .mp4 → All users see avatar speaking
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAvatars,
  createBroadcast,
  fetchBroadcasts,
  getBroadcastVideoUrl,
  pollBroadcastStatus,
} from '../api';

const MAX_CHARS = 500;
const API_URL = process.env.REACT_APP_API_URL || '';

function AdminBroadcast() {
  const navigate = useNavigate();
  const pollRef = useRef(null);

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState('arjun');
  const [message, setMessage] = useState('');
  const [broadcasts, setBroadcasts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [currentBroadcastId, setCurrentBroadcastId] = useState(null);
  const [videoReady, setVideoReady] = useState(null); // { id, video_url }

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAvatars();
        setAvatars(data.avatars || []);
      } catch {
        setAvatars([
          { id: 'arjun', name: 'Arjun', emoji: '👳', color: '#1D9E75', lang_label: 'Hindi', region: 'Delhi / UP' },
          { id: 'priya', name: 'Priya', emoji: '👩‍💼', color: '#534AB7', lang_label: 'Marathi', region: 'Maharashtra' },
          { id: 'murugan', name: 'Murugan', emoji: '👨‍🏫', color: '#D85A30', lang_label: 'Tamil', region: 'Tamil Nadu' },
          { id: 'asha', name: 'Asha', emoji: '👩‍⚕️', color: '#BA7517', lang_label: 'Bengali', region: 'West Bengal' },
          { id: 'bharat', name: 'Bharat', emoji: '👨', color: '#1D4ED8', lang_label: 'English', region: 'Pan India' },
        ]);
      }
    };
    load();
    loadBroadcasts();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const loadBroadcasts = async () => {
    try {
      const data = await fetchBroadcasts();
      setBroadcasts(data.broadcasts || []);
    } catch {
      // Ignore
    }
  };

  const startPolling = useCallback((broadcastId) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const result = await pollBroadcastStatus(broadcastId);

        if (result.status === 'done') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setGenerating(false);
          setCurrentBroadcastId(null);
          setVideoReady({ id: broadcastId, video_url: result.video_url });
          setStatus({
            type: 'success',
            text: `✅ Video generated successfully! Arjun is ready to speak.`,
          });
          loadBroadcasts();
        } else if (result.status === 'failed') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setGenerating(false);
          setCurrentBroadcastId(null);
          setStatus({
            type: 'error',
            text: '❌ Video generation failed. Make sure Colab notebook is running and COLAB_URL is set in .env',
          });
          loadBroadcasts();
        }
      } catch {
        // Keep polling
      }
    }, 3000); // Poll every 3 seconds
  }, []);

  const handleBroadcast = async () => {
    if (!message.trim() || generating) return;

    setGenerating(true);
    setStatus(null);
    setVideoReady(null);

    try {
      const result = await createBroadcast(selectedAvatar, message.trim());

      setCurrentBroadcastId(result.broadcast_id);
      setStatus({
        type: 'info',
        text: `⏳ ${result.message} — Generating lip-sync video... This may take 1-2 minutes.`,
      });

      // Start polling for video completion
      startPolling(result.broadcast_id);
      setMessage('');
    } catch (err) {
      setGenerating(false);
      let errorText = 'Failed to create broadcast. Please try again.';
      if (err.response?.status === 400) {
        const detail = err.response.data?.detail;
        if (detail?.error === 'MCC_VIOLATION') {
          errorText = `⚠️ MCC Violation: ${detail.reason}`;
        }
      }
      setStatus({ type: 'error', text: errorText });
    }
  };

  const currentAvatar = avatars.find((a) => a.id === selectedAvatar) || {};

  const getAvatarImage = (id) => {
    switch(id) {
      case 'arjun': return 'arjunavatar.png';
      case 'priya': return 'maharashtra avatar.png';
      case 'murugan': return 'south indian avatar.png';
      case 'asha': return 'indian Avatar.png';
      case 'bharat': return 'arjunavatar.png';
      default: return `${id}.jpg`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════ TOP HEADER ═══════════ */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                id="admin-back-btn"
                onClick={() => navigate('/')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  🛡️ Admin Broadcast Panel
                </h1>
                <p className="text-white/50 text-sm mt-0.5">
                  भारत Avatar Platform — Generate & broadcast avatar videos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/70">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ═══════════ LEFT: COMPOSE ═══════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Pipeline diagram */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Video Generation Pipeline
              </h3>
              <div className="flex items-center gap-2 flex-wrap text-sm">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">✍️ Admin Message</span>
                <span className="text-gray-300">→</span>
                <span className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg font-medium">🔊 Eden AI TTS</span>
                <span className="text-gray-300">→</span>
                <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg font-medium">🎬 Wav2Lip</span>
                <span className="text-gray-300">→</span>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">📺 Broadcast</span>
              </div>
            </div>

            {/* Avatar selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-xl font-bold text-gray-900 mb-1">
                Select an Avatar
              </label>
              <p className="text-sm text-gray-500 mb-5">Pick the digital representative to deliver the message.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    id={`select-avatar-${av.id}`}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`relative rounded-xl border-2 transition-all duration-200 text-left overflow-hidden h-64
                      ${selectedAvatar === av.id
                        ? 'border-transparent shadow-md scale-[1.02]'
                        : 'border-transparent hover:shadow-sm opacity-90 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={`${API_URL}/photos/${getAvatarImage(av.id)}`}
                      alt={av.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Content over image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-bold text-lg text-white">
                        {av.name}
                      </p>
                      <p className="text-xs text-white/80 mt-0.5">{av.lang_label} Speaker ({av.id === 'priya' || av.id === 'asha' ? 'Female' : 'Male'})</p>
                    </div>

                    {selectedAvatar === av.id && (
                      <span
                        className="absolute top-3 right-3 w-6 h-6 rounded-full text-white text-sm flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: av.color || '#3b82f6' }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Message composer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Broadcast Message
                <span className="font-normal text-gray-400 ml-2">
                  ({currentAvatar.lang_label || 'Hindi'})
                </span>
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Type the message in {currentAvatar.lang_label || 'Hindi'}. The avatar will speak this message in a generated video.
              </p>
              <textarea
                id="broadcast-message"
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
                }}
                placeholder={
                  selectedAvatar === 'arjun' ? 'नमस्ते, मैं अर्जुन हूं। आज मैं आपको PM Kisan योजना के बारे में बताना चाहता हूं...' :
                  selectedAvatar === 'priya' ? 'नमस्कार, मी प्रिया आहे. आज आयुष्मान भारत बद्दल माहिती देणार आहे...' :
                  selectedAvatar === 'murugan' ? 'வணக்கம், நான் முருகன். இன்று கல்வி உதவித்தொகை பற்றி...' :
                  selectedAvatar === 'bharat' ? 'Hello, I am Bharat. Today I want to talk about...' :
                  'নমস্কার, আমি আশা। আজ জননী সুরক্ষা যোজনা সম্পর্কে বলতে চাই...'
                }
                rows={5}
                disabled={generating}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent
                           outline-none text-sm resize-none disabled:opacity-50 transition-all"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${message.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                  {message.length} / {MAX_CHARS}
                </span>
                <button
                  id="broadcast-send-btn"
                  onClick={handleBroadcast}
                  disabled={!message.trim() || generating}
                  className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                             hover:opacity-90 active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: currentAvatar.color || '#1D9E75' }}
                >
                  {generating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Generate & Broadcast
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status alert */}
            {status && (
              <div
                className={`rounded-xl px-5 py-3 text-sm font-medium border ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : status.type === 'info'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {status.text}
              </div>
            )}

            {/* Video preview — shows after generation completes */}
            {videoReady && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-3 flex items-center gap-2"
                  style={{ backgroundColor: (currentAvatar.color || '#1D9E75') + '10' }}>
                  <svg className="w-4 h-4" style={{ color: currentAvatar.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold" style={{ color: currentAvatar.color }}>
                    Generated Broadcast Video
                  </span>
                </div>
                <div className="bg-black aspect-video">
                  <video
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    <source src={getBroadcastVideoUrl(videoReady.id)} type="video/mp4" />
                  </video>
                </div>
                <div className="px-6 py-3 bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-2">
                  <span>✅</span>
                  <span>This video is now live on the landing page for all users to see!</span>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════ RIGHT: PREVIEW + INFO ═══════════ */}
          <div className="space-y-6">
            {/* Avatar preview with photo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Avatar Preview
              </h3>
              <div
                className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center mb-3 overflow-hidden"
                style={{ backgroundColor: (currentAvatar.color || '#1D9E75') + '15' }}
              >
                <img
                  src={`${API_URL}/photos/${getAvatarImage(currentAvatar.id || 'arjun')}`}
                  alt={currentAvatar.name || 'Avatar'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-6xl" style={{ display: 'none' }}>
                  {currentAvatar.emoji}
                </span>
              </div>
              <h4 className="font-bold text-lg" style={{ color: currentAvatar.color }}>
                {currentAvatar.name || 'Arjun'}
              </h4>
              <p className="text-sm text-gray-400">{currentAvatar.region}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: (currentAvatar.color || '#1D9E75') + '15', color: currentAvatar.color }}>
                🌐 {currentAvatar.lang_label || 'Hindi'}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                How It Works
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                  <p>Admin types message in avatar's language</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">2</span>
                  <p>Eden AI converts text → voice audio (.mp3)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">3</span>
                  <p>Wav2Lip animates avatar face with audio</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">4</span>
                  <p>Video (.mp4) broadcast to all users on Landing page</p>
                </div>
              </div>
            </div>

            {/* Colab setup reminder */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
                ⚠️ Colab Required
              </h3>
              <p className="text-xs text-amber-600 leading-relaxed">
                Video generation requires the Colab notebook running with Wav2Lip. 
                Run all 4 cells in <code className="bg-amber-100 px-1 rounded">colab_notebook.ipynb</code> and 
                paste the Cloudflare tunnel URL in <code className="bg-amber-100 px-1 rounded">.env</code> as 
                <code className="bg-amber-100 px-1 rounded">COLAB_URL</code>.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ RECENT BROADCASTS TABLE ═══════════ */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Recent Broadcasts</h3>
            <button
              onClick={loadBroadcasts}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ↻ Refresh
            </button>
          </div>

          {broadcasts.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p className="text-3xl mb-2">📡</p>
              <p>No broadcasts yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 px-3 text-gray-400 font-medium text-xs uppercase">Avatar</th>
                    <th className="text-left py-2.5 px-3 text-gray-400 font-medium text-xs uppercase">Message</th>
                    <th className="text-left py-2.5 px-3 text-gray-400 font-medium text-xs uppercase">Status</th>
                    <th className="text-left py-2.5 px-3 text-gray-400 font-medium text-xs uppercase">Time</th>
                    <th className="text-left py-2.5 px-3 text-gray-400 font-medium text-xs uppercase">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {broadcasts.map((b) => {
                    const av = avatars.find((a) => a.id === b.avatar_id) || {};
                    return (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{av.emoji}</span>
                            <span className="font-medium text-gray-700">{av.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-xs truncate">
                          {b.message}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              b.status === 'done' ? 'bg-emerald-50 text-emerald-700' :
                              b.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                              b.status === 'failed' ? 'bg-red-50 text-red-700' :
                              'bg-gray-50 text-gray-500'
                            }`}
                          >
                            {b.status === 'done' && '✓'}
                            {b.status === 'processing' && '⏳'}
                            {b.status === 'failed' && '✗'}
                            {b.status === 'pending' && '⏱'}
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-xs">
                          {b.created_at ? new Date(b.created_at).toLocaleString('en-IN') : '-'}
                        </td>
                        <td className="py-3 px-3">
                          {b.video_url ? (
                            <a
                              href={getBroadcastVideoUrl(b.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              ▶ Play
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBroadcast;
