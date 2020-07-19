import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api'

export interface IFullTag {
  id: number
  name: string
  parentId: number
}

export type TagsState =
  | { loading: true; data: IFullTag[]; error: null }
  | { loading: false; data: IFullTag[]; error: string }
  | { loading: false; data: IFullTag[]; error: null }

const initialTagsState: Readonly<TagsState> = {
  loading: false,
  data: [],
  error: null,
}

export const fetchTags = createAsyncThunk('records/fetchTags', api.getTags)

export const createTag = createAsyncThunk(
  'records/createTag',
  async (name: string, thunkAPI) => {
    await api.createTag(name)
    thunkAPI.dispatch(fetchTags())
  }
)

const startLoading = (state: TagsState) => {
  state.loading = true
  state.error = null
}

const tagsSlice = createSlice({
  name: 'records',
  initialState: initialTagsState,
  reducers: {},
  extraReducers: {
    [fetchTags.pending.type]: startLoading,
    [fetchTags.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [fetchTags.fulfilled.type]: (state, action) => {
      state.data = action.payload
      state.loading = false
      state.error = null
    },

    [createTag.pending.type]: startLoading,
    [createTag.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [createTag.fulfilled.type]: state => {
      state.loading = false
      state.error = null
    },
  },
})

export const tagsReducer = tagsSlice.reducer
