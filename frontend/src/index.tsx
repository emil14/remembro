import * as React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

import { App } from './components/App'
import { store } from './store'
import './styles.css'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
