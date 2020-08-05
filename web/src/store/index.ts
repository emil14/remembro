import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth'
import { recordsReducer } from './records'
import { tagsReducer } from './tags'

export const store = configureStore({
  reducer: {
    records: recordsReducer,
    tags: tagsReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
