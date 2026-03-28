import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadImage = async (formData) => {
  return API.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const generateAvatar = async (data) => {
  return API.post('/avatar/generate', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getAvatar = async (id) => {
  return API.get(`/avatar/${id}`)
}

export const getMessages = async () => {
  return API.get('/messages')
}

export const getPreviewTranslation = async (data) => {
  return API.post('/preview/translate', data)
}

export const getAnalytics = async () => {
  return API.get('/analytics')
}

// ==================== Auth ====================
export const signUp = async (data) => {
  return API.post('/auth/signup', data)
}

export const signIn = async (data) => {
  return API.post('/auth/login', data)
}

export const getMe = async (leaderId) => {
  return API.get(`/auth/me?leader_id=${leaderId}`)
}

// ==================== Consent — Biometric ====================
export const verifyBiometric = async (leaderId) => {
  return API.post(`/consent/biometric-verify?leader_id=${leaderId}`)
}

export const checkConsent = async (leaderId) => {
  return API.get(`/consent/check/${leaderId}`)
}

// ==================== Consent — Security PIN ====================
export const verifyPin = async (leaderId, securityPin) => {
  return API.post('/consent/verify-pin', { leader_id: leaderId, security_pin: securityPin })
}

// ==================== Consent — Phone OTP ====================
export const sendPhoneOTP = async (leaderId, phone) => {
  return API.post(`/consent/send-otp?leader_id=${leaderId}&phone=${encodeURIComponent(phone)}`)
}

export const verifyPhoneOTP = async (leaderId, otp) => {
  return API.post(`/consent/verify-otp?leader_id=${leaderId}&otp=${otp}`)
}

// ==================== Consent — Email OTP ====================
export const sendEmailOTP = async (leaderId, email) => {
  return API.post(`/consent/send-email-otp?leader_id=${leaderId}&email=${encodeURIComponent(email)}`)
}

export const verifyEmailOTP = async (leaderId, otp) => {
  return API.post(`/consent/verify-email-otp?leader_id=${leaderId}&otp=${otp}`)
}

// ==================== Private Receivers ====================
export const getReceivers = async (leaderId) => {
  return API.get(`/receivers?leader_id=${leaderId}`)
}

export const addReceiver = async (data) => {
  return API.post('/receivers', data)
}

export const sendMessage = async (data) => {
  return API.post('/messages/send', data)
}

export const getMessageHistory = async (leaderId, lang = 'en') => {
  return API.get(`/messages/history?leader_id=${leaderId}&lang=${lang}`)
}

export const markAsRead = async (msgId, leaderId) => {
  return API.post(`/messages/read/${msgId}?leader_id=${leaderId}`)
}

export const uploadReceivers = async (leaderId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post(`/receivers/upload?leader_id=${leaderId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ==================== Avatar Generation ====================

const avatarAuthHeader = (leaderId) => ({
  headers: { Authorization: `Bearer leader:${leaderId}` }
})

export const getReceiverLanguages = (leaderId) =>
  API.get('/avatar/receiver-languages', avatarAuthHeader(leaderId))

export const generateAvatarVideos = (leaderId, data) =>
  API.post('/avatar/generate', data, avatarAuthHeader(leaderId))

export const getMyAvatarVideos = (leaderId, params = {}) =>
  API.get('/avatar/my-videos', {
    ...avatarAuthHeader(leaderId),
    params,
  })

export const getPublicAvatarVideos = (params = {}) =>
  API.get('/avatar/public', { params })

export const toggleAvatarVideoPublic = (leaderId, videoId) =>
  API.patch(`/avatar/${videoId}/toggle-public`, {}, avatarAuthHeader(leaderId))

export const deleteAvatarVideo = (leaderId, videoId) =>
  API.delete(`/avatar/${videoId}`, avatarAuthHeader(leaderId))

export const getAvatarVideoById = (videoId) =>
  API.get(`/avatar/${videoId}`)

export const registerModalUrl = (url) =>
  API.post('/avatar/register-url', { url })

export default API

