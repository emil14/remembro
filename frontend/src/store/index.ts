import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootSaga } from './sagas'
import { rootReducer, RootState } from './reducers'
import { RootAction } from './actions'

const sagaMiddleware = createSagaMiddleware()
const errorHandlerMiddlware = (store: RootState) => next => (
  action: RootAction
) => {
  if (action.error) {
    console.error(action.error)
  }
}

const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware))
const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export { store }
