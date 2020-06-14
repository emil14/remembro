import { Reducer, combineReducers } from 'redux'
import {
  RootAction,
  GetRecordsActionTypes,
  CreateRecordActionTypes,
  RecordsActions,
  TagsActions,
  CreateTagActionTypes,
  GetTagsActionTypes,
} from './actions'

export interface Record {
  id: string
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

function recordsReducer(
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

export interface Tag {
  id: string
  name: string
}

export interface TagsState {
  loading: boolean
  data: Tag[]
  error: string | null
}

const initialTagsState: TagsState = {
  loading: false,
  data: [],
  error: null,
}

function tagsReducer(
  state: TagsState = initialTagsState,
  action: TagsActions
): TagsState {
  switch (action.type) {
    case GetTagsActionTypes.REQUESTED:
    case CreateTagActionTypes.REQUESTED:
      return { data: state.data, loading: true, error: state.error }
    case GetTagsActionTypes.FAILED:
    case CreateTagActionTypes.FAILED:
      return { data: state.data, loading: false, error: action.error }
    case GetTagsActionTypes.SUCCEEDED:
      return { data: action.payload, loading: false, error: null }
    case CreateTagActionTypes.SUCCEEDED:
      return { data: state.data, loading: false, error: null }
    default:
      return state
  }
}

export interface RootState {
  records: RecordsState
  tags: TagsState
}

export const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  records: recordsReducer,
  tags: tagsReducer,
})
