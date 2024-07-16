import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { validateToken } from "../utils/auth"

interface AuthState {
  token: string | null
  isAuthenticated: boolean
}
const token = localStorage.getItem("token")
const isTokenValid = validateToken(token)
const initialState: AuthState = {
  token,
  isAuthenticated: isTokenValid,
}

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveToken(state, { payload }: PayloadAction<string>) {
      if (payload) {
        state.token = payload
        localStorage.setItem("token", payload)
      }
    },
    clearToken(state) {
      state.token = null
      localStorage.removeItem("token")
    },
    setAuthState(state, { payload }: PayloadAction<boolean>) {
      state.isAuthenticated = payload
    },
  },
})

export const { saveToken, clearToken, setAuthState } = auth.actions

export default auth.reducer
