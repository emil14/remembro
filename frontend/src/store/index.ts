import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

interface RootState {}
// type RootAction

const reducer = () => ({})
const enhancer = composeWithDevTools(applyMiddleware(createSagaMiddleware()))

export const store = createStore(reducer, enhancer)
