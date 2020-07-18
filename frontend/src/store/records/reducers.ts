import {
  GetRecordsActionTypes,
  CreateRecordActionTypes,
  RecordsActions,
  UpdateRecordActionTypes,
} from './actions'

/**
 * `IRecordTag` represents a subtype of IFullRecord
 */
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

export function recordsReducer(
  state: RecordsState = initialRecordsState,
  action: RecordsActions
): RecordsState {
  switch (action.type) {
    case UpdateRecordActionTypes.REQUESTED:
    case GetRecordsActionTypes.REQUESTED:
    case CreateRecordActionTypes.REQUESTED:
      return { data: state.data, loading: true, error: state.error }
    case GetRecordsActionTypes.FAILED:
    case CreateRecordActionTypes.FAILED:
    case UpdateRecordActionTypes.FAILED:
      return { data: state.data, loading: false, error: action.error }
    case GetRecordsActionTypes.SUCCEEDED:
      return { data: action.payload, loading: false, error: null }
    case CreateRecordActionTypes.SUCCEEDED:
    case UpdateRecordActionTypes.SUCCEEDED:
      return { data: state.data, loading: false, error: null }
    default:
      return state
  }
}
