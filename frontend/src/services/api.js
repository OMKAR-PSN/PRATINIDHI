import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
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

// ==================== Consent — Biometric ====================
export const verifyBiometric = async (leaderId) => {
  return API.post(`/consent/biometric-verify?leader_id=${leaderId}`)
}

export const checkConsent = async (leaderId) => {
  return API.get(`/consent/check/${leaderId}`)
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

export default API
