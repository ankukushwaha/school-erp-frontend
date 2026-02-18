import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthenticatedRole, Role, User } from '@/types/auth'

type AuthState = {
  user: User | null
  token: string | null
  role: Role
}

type LoginPayload = {
  user: User
  token: string
  role: AuthenticatedRole
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.role = action.payload.role
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
