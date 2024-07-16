import axios from "axios"
import { useNavigate } from "react-router-dom"
import store from "../redux/store"

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

client.interceptors.request.use((config) => {
  const token = store.getState()?.auth?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response.status)) {
      localStorage.removeItem("token")
      window.location.href = "/"
    }
  },
)
