/**
 * Landing.jsx — Landing Page with Hero, Broadcast Viewer, Avatar Grid, and Feature Cards
 * भारत Avatar Platform — India Innovates 2026
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAvatars, fetchLatestBroadcast, getBroadcastVideoUrl } from '../api';
import AvatarCard from '../components/AvatarCard';

function Landing() {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcast, setBroadcast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const data = await fetchAvatars();
        setAvatars(data.avatars || []);
      } catch (err) {
        console.error('Failed to load avatars:', err);
        setAvatars([
          { id: 'arjun', name: 'Arjun', title: 'उत्तर भारत सरकारी सहायक', region: 'Delhi / Uttar Pradesh', language: 'hi', lang_label: 'Hindi', gender: 'male', emoji: '👳', color: '#1D9E75', bg_color: '#E1F5EE', greeting: 'नमस्ते! मैं अर्जुन हूं, आपका उत्तर भारत सरकारी सहायक।', topics: ['PM Kisan', 'PM Awas Yojana', 'Ration Card', 'Jan Dhan', 'Mudra Loan', 'MGNREGA'], persona: 'Formal government officer' },
          { id: 'priya', name: 'Priya', title: 'महाराष्ट्र नागरी सहाय्यक', region: 'Maharashtra', language: 'mr', lang_label: 'Marathi', gender: 'female', emoji: '👩‍💼', color: '#534AB7', bg_color: '#EEEDFE', greeting: 'नमस्कार! मी प्रिया आहे, तुमची महाराष्ट्र नागरी सहाय्यक।', topics: ['Ayushman Bharat', 'Mahila Samman', 'Swachh Bharat', 'Ladki Bahin', 'MGNREGA'], persona: 'Friendly civic worker' },
          { id: 'murugan', name: 'Murugan', title: 'தமிழ்நாடு கல்வி உதவியாளர்', region: 'Tamil Nadu', language: 'ta', lang_label: 'Tamil', gender: 'male', emoji: '👨‍🏫', color: '#D85A30', bg_color: '#FAECE7', greeting: 'வணக்கம்! நான் முருகன், உங்கள் தமிழ்நாடு கல்வி உதவியாளர்.', topics: ['Mid-Day Meal', 'NSP Scholarships', 'RTE Act', 'PM SHRI Schools', 'Samagra Shiksha'], persona: 'Teacher persona' },
          { id: 'asha', name: 'Asha', title: 'পশ্চিমবঙ্গ স্বাস্থ্য সহকারী', region: 'West Bengal', language: 'bn', lang_label: 'Bengali', gender: 'female', emoji: '👩‍⚕️', color: '#BA7517', bg_color: '#FAEEDA', greeting: 'নমস্কার! আমি আশা, আপনার পশ্চিমবঙ্গ স্বাস্থ্য সহকারী।', topics: ['Janani Suraksha', 'Beti Bachao', 'Sukanya Samriddhi', 'Vaccination', 'Ayushman Bharat'], persona: 'Health worker' },
          { id: 'bharat', name: 'Bharat', title: 'National English Assistant', region: 'Pan India', language: 'en', lang_label: 'English', gender: 'male', emoji: '👨', color: '#1D4ED8', bg_color: '#EFF6FF', greeting: 'Hello! I am Bharat, your national government assistant.', topics: ['PM Kisan', 'Ayushman Bharat', 'Digital India', 'Startup India', 'Make in India'], persona: 'Modern advisor' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadAvatars();
    loadBroadcast();
  }, []);

  const loadBroadcast = async () => {
    try {
      const data = await fetchLatestBroadcast();
      if (data.broadcast) {
        setBroadcast(data.broadcast);
      }
    } catch {
      // No broadcast available
    }
  };

  const handleAvatarClick = (avatar) => {
    navigate(`/avatar/${avatar.id}`);
  };

  const stats = [
    { value: '5', label: 'Regional Avatars', icon: '🎭' },
    { value: '5', label: 'Languages', icon: '🗣️' },
    { value: '2.5L+', label: 'Panchayats', icon: '🏘️' },
    { value: '600M+', label: 'Citizens', icon: '👥' },
  ];

  const features = [
    { icon: '🔒', title: 'Consent-Locked', desc: 'Biometric OTP before any avatar creation. Deepfake-proof.' },
    { icon: '📡', title: 'Works Offline', desc: '240p WhatsApp delivery. Works on 2G. No internet for viewing.' },
    { icon: '🏛️', title: 'MCC Compliant', desc: 'AI filter checks content against Election Commission rules.' },
  ];

  const API_URL = process.env.REACT_APP_API_URL || '';
  const GOLD_VIDEOS = {
    arjun: '/demo/arjun',
    priya: '/demo/priya',
    murugan: '/demo/murugan',
    asha: '/demo/asha',
  };
  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]" />
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              India Innovates 2026 — Municipal Corporation of Delhi
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-[#1D9E75] via-[#4ECCA3] to-[#1D9E75] bg-clip-text text-transparent">
              भारत Avatar
            </span>
            <br />
            <span className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Platform
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-white/70 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-12 font-light">
            One Platform. Every Language. Every Citizen.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm 
                           border border-white/10 hover:bg-white/10 transition-all duration-300 min-w-[140px]"
              >
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-white/60 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 60Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ═══════════ BROADCAST VIEWER (All Users See This) ═══════════ */}
      {broadcast && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Broadcast header */}
            <div className="px-6 py-4 flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${broadcast.avatar_color}15, ${broadcast.avatar_color}05)` }}>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: broadcast.avatar_color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: broadcast.avatar_color }}>
                  Live Broadcast
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{broadcast.avatar_emoji}</span>
                <span className="font-bold text-gray-800">{broadcast.avatar_name}</span>
              </div>
            </div>

            {/* Video player */}
            <div className="bg-black aspect-video flex items-center justify-center">
              <video
                id="broadcast-video"
                controls
                autoPlay
                className="w-full h-full"
                poster=""
              >
                <source src={`${API_URL}${broadcast.video_url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Broadcast message */}
            <div className="px-6 py-4 bg-gray-50">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-medium" style={{ color: broadcast.avatar_color }}>
                  {broadcast.avatar_emoji} {broadcast.avatar_name}:
                </span>{' '}
                "{broadcast.message}"
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {broadcast.created_at ? new Date(broadcast.created_at).toLocaleString('en-IN', {
                  dateStyle: 'medium', timeStyle: 'short'
                }) : ''}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ AVATAR GRID ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Regional Avatar
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Each avatar speaks your language and knows your region's schemes
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1D9E75] rounded-full animate-spin" />
              <p className="text-gray-500">Loading avatars...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avatars.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                onClick={handleAvatarClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ FEATURE CARDS ═══════════ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                           hover:shadow-md hover:border-gray-200 transition-all duration-300"
              >
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#0f172a] text-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#1D9E75] font-bold">भारत Avatar</span>
            <span className="text-white/40">|</span>
            <span className="text-sm">India Innovates 2026</span>
          </div>
          <div className="flex gap-4 text-sm">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
            <a href="#top" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
