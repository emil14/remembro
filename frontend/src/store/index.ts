import { createStore, applyMiddleware, Middleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootSaga } from './sagas'
import { rootReducer, RootState } from './reducers'
import { RootAction } from './actions'

const sagaMiddleware = createSagaMiddleware()
const crashReporterMiddlware = (store: RootState) => next => (
  action: RootAction
) => {
  try {
    next(action)
  } catch (err) {
    console.error(err)
  }
}

const enhancer = composeWithDevTools(
  applyMiddleware(sagaMiddleware, crashReporterMiddlware)
)
const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export { store }
