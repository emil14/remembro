import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api'

export type User =
  | {
      isAuthethicated: true
      user: {
        id: number
        email: string
      }
    }
  | {
      isAuthethicated: false
      user: null
    }

export type UserState = {
  loading: boolean
  data: User
  error: string | null
}

const initialUserState: Readonly<UserState> = {
  loading: false,
  data: { isAuthethicated: false, user: null },
  error: null,
}

export const registerUser = createAsyncThunk('auth/register', api.registerUser)
export const authorizeUser = createAsyncThunk('auth/authorize', api.authorizeUser)

const startLoading = (state: UserState) => {
  state.loading = true
  state.error = null
}

const authSlice = createSlice({
  name: 'records',
  initialState: initialUserState,
  reducers: {},
  extraReducers: {
    [registerUser.pending.type]: startLoading,
    [registerUser.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [registerUser.fulfilled.type]: state => {
      state.loading = false
      state.error = null
    },
    [authorizeUser.pending.type]: startLoading,
    [authorizeUser.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
      state.data = { isAuthethicated: false, user: null }
    },
    [authorizeUser.fulfilled.type]: (state, action) => {
      state.loading = false
      state.error = null
      state.data = { isAuthethicated: true, user: action.payload }
    },
  },
})

export const authReducer = authSlice.reducer
