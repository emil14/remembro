import { configureStore } from '@reduxjs/toolkit'
import { recordsReducer } from './records'
import { tagsReducer } from './tags'

export const store = configureStore({
  reducer: { records: recordsReducer, tags: tagsReducer },
})

export type RootState = ReturnType<typeof store.getState>
