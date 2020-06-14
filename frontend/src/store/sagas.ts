import { call, put, takeEvery, all } from 'redux-saga/effects'

import { api } from '../api'
import {
  GetRecordsActionTypes,
  getRecordsSuccessed,
  getRecordsFaileed,
  CreateRecordRequestedAction,
  createRecordSuccessed,
  createRecordFaileed,
  CreateRecordActionTypes,
} from './actions'

function* getRecordsRequestedSaga() {
  try {
    const record = yield call(api.getRecords)
    yield put(getRecordsSuccessed(record))
  } catch (e) {
    yield put(getRecordsFaileed(e.message))
  }
}

function* watchGetRecordsSaga() {
  yield takeEvery(
    GetRecordsActionTypes.GET_RECORDS_REQUESTED,
    getRecordsRequestedSaga
  )
}

function* createRecordsSaga(action: CreateRecordRequestedAction) {
  try {
    yield call(api.createRecord, action.payload.content)
    yield put(createRecordSuccessed())
  } catch (e) {
    yield put(createRecordFaileed(e.message))
  }
}

function* watchCreateRecordsSaga() {
  yield takeEvery(
    CreateRecordActionTypes.CREATE_RECORD_REQUESTED,
    createRecordsSaga
  )
}

function* rootSaga() {
  yield all([watchGetRecordsSaga(), watchCreateRecordsSaga()])
}

export { rootSaga }
