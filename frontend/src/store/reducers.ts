import { Reducer } from 'redux'
import { RootAction, GetRecordsActionTypes } from './actions'

export interface Record {
  id: string
  content: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
}

export interface RootState {
  isLoading: boolean
  records: Record[]
  tags: Tag[]
}

const initialState: Readonly<RootState> = {
  isLoading: false,
  records: [],
  tags: [],
}

export const reducer: Reducer<RootState, RootAction> = (
  state = initialState,
  action: RootAction
): RootState => {
  switch (action.type) {
    case GetRecordsActionTypes.GET_RECORDS_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        records: action.payload,
      }
    default:
      return state
  }
}
