import { call, put, takeEvery } from 'redux-saga/effects'
import { api } from '../../api'
import {
  getRecordsSucceeded,
  getRecordsFailed,
  GetRecordsActionTypes,
  CreateRecordRequestedAction,
  createRecordSucceeded,
  createRecordFaileed,
  CreateRecordActionTypes,
} from './actions'

function* getRecordsSaga() {
  try {
    const record = yield call(api.getRecords)
    yield put(getRecordsSucceeded(record))
  } catch (e) {
    yield put(getRecordsFailed(e.message))
  }
}

export function* watchGetRecordsSaga() {
  yield takeEvery(GetRecordsActionTypes.REQUESTED, getRecordsSaga)
}

function* createRecordsSaga(action: CreateRecordRequestedAction) {
  try {
    yield call(api.createRecord, action.payload.content, action.payload.tagsIds)
    yield put(createRecordSucceeded())
  } catch (e) {
    yield put(createRecordFaileed(e.message))
  }
}

export function* watchCreateRecordSaga() {
  yield takeEvery(CreateRecordActionTypes.REQUESTED, createRecordsSaga)
}
