import { Reducer, combineReducers } from 'redux'

import { RootAction } from './actions'
import { RecordsState, recordsReducer } from './records/reducers'
import { TagsState, tagsReducer } from './tags/reducers'

export interface RootState {
  records: RecordsState
  tags: TagsState
}

export const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  records: recordsReducer,
  tags: tagsReducer,
})
