import axios from 'axios'

const localBaseURL = 'https://localhost:7240/api'
const productionBaseURL = '/api'

const baseURL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL_LOCAL ?? localBaseURL)
  : (import.meta.env.VITE_API_BASE_URL_PROD ?? productionBaseURL)

export const backendApi = axios.create({
  baseURL,
  // timeout: 15000,
})

