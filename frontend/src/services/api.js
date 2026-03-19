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

export default API
