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
  UpdateRecordRequestedAction,
  updateRecordSucceeded,
  updateRecordFaileed,
  UpdateRecordActionTypes,
  getRecordsRequested,
} from './actions'

// GET RECORDS
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

// CREATE RECORD
function* createRecordsSaga(action: CreateRecordRequestedAction) {
  try {
    yield call(api.createRecord, action.payload)
    yield put(createRecordSucceeded())
    yield put(getRecordsRequested())
  } catch (e) {
    yield put(createRecordFaileed(e.message))
  }
}

export function* watchCreateRecordSaga() {
  yield takeEvery(CreateRecordActionTypes.REQUESTED, createRecordsSaga)
}

// UPDATE RECORD
function* updateRecordsSaga(action: UpdateRecordRequestedAction) {
  try {
    yield call(
      api.updateRecord,
      action.payload.id,
      action.payload.content,
      action.payload.tagsIds
    )
    yield put(updateRecordSucceeded())
    yield put(getRecordsRequested())
  } catch (e) {
    yield put(updateRecordFaileed(e.message))
  }
}

export function* watchUpdateRecordSaga() {
  yield takeEvery(UpdateRecordActionTypes.REQUESTED, updateRecordsSaga)
}
