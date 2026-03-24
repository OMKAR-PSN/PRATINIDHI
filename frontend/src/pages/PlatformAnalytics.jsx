/**
 * Dashboard.jsx — Analytics Dashboard with Charts
 * भारत Avatar Platform — India Innovates 2026
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnalytics } from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DEFAULT_AVATARS = {
  arjun: { name: 'Arjun', emoji: '👳', color: '#1D9E75', language: 'Hindi', total_sessions: 0, completed_sessions: 0, qa_sessions: 0, completion_rate: 0 },
  priya: { name: 'Priya', emoji: '👩‍💼', color: '#534AB7', language: 'Marathi', total_sessions: 0, completed_sessions: 0, qa_sessions: 0, completion_rate: 0 },
  murugan: { name: 'Murugan', emoji: '👨‍🏫', color: '#D85A30', language: 'Tamil', total_sessions: 0, completed_sessions: 0, qa_sessions: 0, completion_rate: 0 },
  asha: { name: 'Asha', emoji: '👩‍⚕️', color: '#BA7517', language: 'Bengali', total_sessions: 0, completed_sessions: 0, qa_sessions: 0, completion_rate: 0 },
  bharat: { name: 'Bharat', emoji: '👨', color: '#1D4ED8', language: 'English', total_sessions: 0, completed_sessions: 0, qa_sessions: 0, completion_rate: 0 },
};

function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(DEFAULT_AVATARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        if (data.analytics) {
          setAnalytics({ ...DEFAULT_AVATARS, ...data.analytics });
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const avatarIds = ['arjun', 'priya', 'murugan', 'asha', 'bharat'];
  const avatarNames = avatarIds.map((id) => analytics[id]?.name || id);
  const avatarColors = avatarIds.map((id) => analytics[id]?.color || '#999');

  // Chart.js data
  const chartData = {
    labels: avatarNames,
    datasets: [
      {
        label: 'Video Sessions',
        data: avatarIds.map((id) => analytics[id]?.total_sessions || 0),
        backgroundColor: avatarColors.map((c) => c + '90'),
        borderColor: avatarColors,
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Q&A Sessions',
        data: avatarIds.map((id) => analytics[id]?.qa_sessions || 0),
        backgroundColor: avatarColors.map((c) => c + '40'),
        borderColor: avatarColors.map((c) => c + '80'),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
      title: { display: true, text: 'Sessions by Avatar', font: { size: 16, weight: '600' }, padding: 16 },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { stepSize: 1 },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // Total stats
  const totalVideos = avatarIds.reduce((sum, id) => sum + (analytics[id]?.total_sessions || 0), 0);
  const totalQA = avatarIds.reduce((sum, id) => sum + (analytics[id]?.qa_sessions || 0), 0);
  const totalCompleted = avatarIds.reduce((sum, id) => sum + (analytics[id]?.completed_sessions || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Home
            </button>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-white/60 text-sm">भारत Avatar Platform — Real-time Insights</p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="px-4 py-2 rounded-lg bg-white/10">
              <p className="text-2xl font-bold">{totalVideos}</p>
              <p className="text-xs text-white/60">Videos</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/10">
              <p className="text-2xl font-bold">{totalQA}</p>
              <p className="text-xs text-white/60">Q&A</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/10">
              <p className="text-2xl font-bold">{totalCompleted}</p>
              <p className="text-xs text-white/60">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ═══════════ AVATAR STAT CARDS ═══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {avatarIds.map((id) => {
            const av = analytics[id] || DEFAULT_AVATARS[id];
            return (
              <div key={id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: av.color }}>
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-white font-bold">{av.name}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Videos Generated</span>
                    <span className="text-lg font-bold" style={{ color: av.color }}>
                      {av.total_sessions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Q&A Sessions</span>
                    <span className="text-lg font-bold" style={{ color: av.color }}>
                      {av.qa_sessions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Completion Rate</span>
                    <span className="text-lg font-bold" style={{ color: av.color }}>
                      {av.completion_rate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════ BAR CHART ═══════════ */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-[350px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* ═══════════ RECENT ACTIVITY TABLE ═══════════ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avatar</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {avatarIds.map((id) => {
                  const av = analytics[id] || DEFAULT_AVATARS[id];
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{av.emoji}</span>
                          <span className="font-medium text-gray-900">{av.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: av.color }}
                        >
                          {av.language}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {av.total_sessions}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {av.qa_sessions}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
