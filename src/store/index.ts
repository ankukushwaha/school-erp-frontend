import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slices/authSlice'
import uiReducer from '@/store/slices/uiSlice'

const AUTH_KEY = 'auth_state'

function loadAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return undefined
    return { auth: JSON.parse(raw) }
  } catch {
    return undefined
  }
}

function saveAuthState(state: RootState) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state.auth))
  } catch {
    // ignore write errors
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  preloadedState: loadAuthState(),
})

store.subscribe(() => saveAuthState(store.getState()))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
