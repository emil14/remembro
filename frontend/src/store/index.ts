import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootSaga } from './sagas'
import { rootReducer } from './reducers'

const sagaMiddleware = createSagaMiddleware()
const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware))
const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export { store }
