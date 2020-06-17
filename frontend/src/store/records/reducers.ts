import { Reducer, combineReducers } from 'redux'
import {
  GetRecordsActionTypes,
  CreateRecordActionTypes,
  RecordsActions,
} from './actions'

export interface Record {
  id: number
  content: string
  created_at: string
}

export interface RecordsState {
  loading: boolean
  data: Record[]
  error: string | null
}

const initialRecordsState: Readonly<RecordsState> = {
  loading: false,
  data: [],
  error: null,
}

export function recordsReducer(
  state: RecordsState = initialRecordsState,
  action: RecordsActions
): RecordsState {
  switch (action.type) {
    case GetRecordsActionTypes.REQUESTED:
    case CreateRecordActionTypes.REQUESTED:
      return { data: state.data, loading: true, error: state.error }
    case GetRecordsActionTypes.FAILED:
    case CreateRecordActionTypes.FAILED:
      return { data: state.data, loading: false, error: action.error }
    case GetRecordsActionTypes.SUCCEEDED:
      return { data: action.payload, loading: false, error: null }
    case CreateRecordActionTypes.SUCCEEDED:
      return { data: state.data, loading: false, error: null }
    default:
      return state
  }
}
