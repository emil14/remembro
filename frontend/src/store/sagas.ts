import { call, put, takeEvery, all } from 'redux-saga/effects'

import { api } from '../api'
import {
  GetRecordsActionTypes,
  getRecordsSucceeded,
  getRecordsFailed,
  CreateRecordRequestedAction,
  createRecordSucceeded,
  createRecordFaileed,
  CreateRecordActionTypes,
  GetTagsActionTypes,
  CreateTagRequestedAction,
  createTagSucceeded,
  createTagFaileed,
  CreateTagActionTypes,
  getTagsSucceeded,
  getTagsFailed,
} from './actions'

function* getRecordsSaga() {
  try {
    const record = yield call(api.getRecords)
    yield put(getRecordsSucceeded(record))
  } catch (e) {
    yield put(getRecordsFailed(e.message))
  }
}

function* watchGetRecordsSaga() {
  yield takeEvery(GetRecordsActionTypes.REQUESTED, getRecordsSaga)
}

function* createRecordsSaga(action: CreateRecordRequestedAction) {
  try {
    yield call(api.createRecord, action.payload.content)
    yield put(createRecordSucceeded())
  } catch (e) {
    yield put(createRecordFaileed(e.message))
  }
}

function* watchCreateRecordSaga() {
  yield takeEvery(CreateRecordActionTypes.REQUESTED, createRecordsSaga)
}

function* getTagsSaga() {
  try {
    const record = yield call(api.getTags)
    yield put(getTagsSucceeded(record))
  } catch (e) {
    yield put(getTagsFailed(e.message))
  }
}

function* watchGetTagsSaga() {
  yield takeEvery(GetTagsActionTypes.REQUESTED, getTagsSaga)
}

function* createTagSaga(action: CreateTagRequestedAction) {
  try {
    yield call(api.createTag, action.payload.content)
    yield put(createTagSucceeded())
  } catch (e) {
    yield put(createTagFaileed(e.message))
  }
}

function* watchCreateTagSaga() {
  yield takeEvery(CreateTagActionTypes.REQUESTED, createTagSaga)
}

function* rootSaga() {
  yield all([
    watchGetRecordsSaga(),
    watchCreateRecordSaga(),
    watchGetTagsSaga(),
    watchCreateTagSaga(),
  ])
}

export { rootSaga }
