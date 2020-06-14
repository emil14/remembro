import { call, put, takeEvery } from 'redux-saga/effects'

import { api } from '../../api'
import {
  GetTagsActionTypes,
  CreateTagRequestedAction,
  createTagSucceeded,
  createTagFaileed,
  CreateTagActionTypes,
  getTagsSucceeded,
  getTagsFailed,
} from './actions'

function* getTagsSaga() {
  try {
    const record = yield call(api.getTags)
    yield put(getTagsSucceeded(record))
  } catch (e) {
    yield put(getTagsFailed(e.message))
  }
}

export function* watchGetTagsSaga() {
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

export function* watchCreateTagSaga() {
  yield takeEvery(CreateTagActionTypes.REQUESTED, createTagSaga)
}
