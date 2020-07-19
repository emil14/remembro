import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import { recordsReducer, RecordsState } from './records'

type RootState = RecordsState // TODO

export const store = configureStore({
  reducer: { records: recordsReducer },
})

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
