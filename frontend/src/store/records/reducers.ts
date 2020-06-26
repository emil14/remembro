import {
  GetRecordsActionTypes,
  CreateRecordActionTypes,
  RecordsActions,
  UpdateRecordActionTypes,
} from './actions'

export interface IRecord {
  readonly id: number
  readonly content: string
  readonly createdAt: string
  readonly tagsIds: number[]
}

export interface RecordsState {
  readonly loading: boolean
  readonly data: IRecord[]
  readonly error: string | null
}

const initialRecordsState: RecordsState = {
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
