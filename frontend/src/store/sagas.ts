import { all } from 'redux-saga/effects'
import {
  watchGetRecordsSaga,
  watchCreateRecordSaga,
  watchUpdateRecordSaga,
} from './records/sagas'
import { watchGetTagsSaga, watchCreateTagSaga } from './tags/sagas'

export function* rootSaga() {
  yield all([
    watchGetRecordsSaga(),
    watchCreateRecordSaga(),
    watchGetTagsSaga(),
    watchCreateTagSaga(),
    watchUpdateRecordSaga(),
  ])
}
