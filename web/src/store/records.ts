import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api, IRecordToCreate, IRecordToUpdate } from '../api'

export interface IRecordTag {
  id: number
  name: string
}

export interface IRecord {
  id: number
  content: string
  createdAt: string
  tags: IRecordTag[]
  reminders: string[]
}

export type RecordsState =
  | { loading: true; data: IRecord[]; error: null }
  | { loading: false; data: IRecord[]; error: string }
  | { loading: false; data: IRecord[]; error: null }

const initialRecordsState: Readonly<RecordsState> = {
  loading: false,
  data: [],
  error: null,
}

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  api.getRecords
)

export const createRecord = createAsyncThunk(
  'records/createRecord',
  async (record: IRecordToCreate, thunkAPI) => {
    await api.createRecord(record)
    thunkAPI.dispatch(fetchRecords())
  }
)

export const updateRecord = createAsyncThunk(
  'records/updateRecord',
  async (record: IRecordToUpdate, thunkAPI) => {
    await api.updateRecord(record)
    thunkAPI.dispatch(fetchRecords())
  }
)

const startLoading = (state: RecordsState) => {
  state.loading = true
  state.error = null
}

const todosSlice = createSlice({
  name: 'records',
  initialState: initialRecordsState,
  reducers: {},
  extraReducers: {
    [fetchRecords.pending.type]: startLoading,
    [fetchRecords.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [fetchRecords.fulfilled.type]: (state, action) => {
      state.data = action.payload
      state.loading = false
      state.error = null
    },

    [createRecord.pending.type]: startLoading,
    [createRecord.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [createRecord.fulfilled.type]: state => {
      state.loading = false
      state.error = null
    },

    [updateRecord.pending.type]: startLoading,
    [updateRecord.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [updateRecord.fulfilled.type]: state => {
      state.loading = false
      state.error = null
    },
  },
})

export const recordsReducer = todosSlice.reducer
