import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { Options } from 'jwt-decode'
import { api, IUserCreds } from '../api'

const jwtDecode = require('jwt-decode')

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

function getUserInitialState(): User {
  const token = localStorage.getItem('token')
  if (token === null) {
    return { isAuthethicated: false, user: null }
  }
  try {
    const { id } = jwtDecode(token)
    return {
      isAuthethicated: true,
      user: { id },
    }
  } catch (err) {
    console.warn(`Invalid token ${token}`)
    return { isAuthethicated: false, user: null }
  }
}

const initialUserState: Readonly<UserState> = {
  loading: false,
  data: getUserInitialState(),
  error: null,
}

export const registerUser = createAsyncThunk('auth/register', api.registerUser)

export const authorizeUser = createAsyncThunk(
  'auth/authorize',
  async (creds: IUserCreds) => {
    const resp = await api.authorizeUser(creds)
    const token = resp.headers.get('Authorization')
    if (token !== null) {
      localStorage.setItem('token', token)
    }
  }
)

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
