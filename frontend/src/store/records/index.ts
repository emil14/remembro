import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api'

export interface IRecordTag {
  id: number
  name: string
}
export interface IReminder {
  id: number
  time: string
}
export interface IRecord {
  id: number
  content: string
  createdAt: string
  tags: IRecordTag[]
  reminders: IReminder[]
}
export interface RecordsState {
  loading: boolean
  data: IRecord[]
  error: string | null
}
const initialRecordsState: Readonly<RecordsState> = {
  loading: false,
  data: [],
  error: null,
}

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  api.getRecords
)

const todosSlice = createSlice({
  name: 'todos',
  initialState: initialRecordsState,
  reducers: {
    getRecords(state, action) {
      state.data = action.payload
    },
  },
  extraReducers: {
    [fetchRecords.fulfilled]: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { getRecords } = todosSlice.actions

export const recordsReducer = todosSlice.reducer
