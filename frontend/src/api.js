/**
 * api.js — Axios API Client
 * भारत Avatar Platform — India Innovates 2026
 */

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

/**
 * Fetch all 4 avatars.
 */
export const fetchAvatars = async () => {
  const response = await API.get('/avatars');
  return response.data;
};

/**
 * Fetch a single avatar by ID.
 */
export const fetchAvatar = async (avatarId) => {
  const response = await API.get(`/avatars/${avatarId}`);
  return response.data;
};

/**
 * Request phone-based consent (OTP generation).
 */
export const requestConsent = async (phone) => {
  const formData = new FormData();
  formData.append('phone', phone);
  const response = await API.post('/request-consent', formData);
  return response.data;
};

/**
 * Verify OTP for consent.
 */
export const verifyConsent = async (consentId, otp) => {
  const formData = new FormData();
  formData.append('consent_id', consentId);
  formData.append('otp', otp);
  const response = await API.post('/verify-consent', formData);
  return response.data;
};

/**
 * Start async video generation for an avatar.
 */
export const generateVideo = async (avatarId, text) => {
  const formData = new FormData();
  formData.append('text', text);
  const response = await API.post(`/generate/${avatarId}`, formData);
  return response.data;
};

/**
 * Poll video generation status.
 */
export const pollStatus = async (sessionId) => {
  const response = await API.get(`/status/${sessionId}`);
  return response.data;
};

/**
 * Get the video URL for a completed session.
 */
export const getVideoUrl = (sessionId) => {
  const baseURL = process.env.REACT_APP_API_URL || '';
  return `${baseURL}/video/${sessionId}`;
};

/**
 * Get the demo (gold) video URL for an avatar.
 */
export const getDemoUrl = (avatarId) => {
  const baseURL = process.env.REACT_APP_API_URL || '';
  return `${baseURL}/demo/${avatarId}`;
};

/**
 * Ask an avatar a question — returns audio blob.
 */
export const askAvatar = async (avatarId, question) => {
  const formData = new FormData();
  formData.append('question', question);
  const response = await API.post(`/ask/${avatarId}`, formData, {
    responseType: 'blob',
  });
  return response;
};

/**
 * Fetch analytics data.
 */
export const fetchAnalytics = async () => {
  const response = await API.get('/analytics');
  return response.data;
};

/**
 * Admin: Create a new broadcast video message.
 */
export const createBroadcast = async (avatarId, message) => {
  const formData = new FormData();
  formData.append('avatar_id', avatarId);
  formData.append('message', message);
  const response = await API.post('/admin/broadcast', formData);
  return response.data;
};

/**
 * Admin: Fetch all broadcast messages.
 */
export const fetchBroadcasts = async () => {
  const response = await API.get('/admin/broadcasts');
  return response.data;
};

/**
 * Get the broadcast video URL.
 */
export const getBroadcastVideoUrl = (broadcastId) => {
  const baseURL = process.env.REACT_APP_API_URL || '';
  return `${baseURL}/admin/broadcast/${broadcastId}/video`;
};

/**
 * Public: Fetch the latest completed broadcast for all users.
 */
export const fetchLatestBroadcast = async () => {
  const response = await API.get('/broadcasts/latest');
  return response.data;
};

/**
 * Poll broadcast generation status.
 */
export const pollBroadcastStatus = async (broadcastId) => {
  const response = await API.get(`/broadcasts/${broadcastId}/status`);
  return response.data;
};

export default API;
