import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { routingMap } from '../routing'
import { getRecordsRequested } from '../store/actions'

import { TextArea } from './common/TextArea'
import { RecordSaver } from './RecordSaver'
import { Navigator } from './Navigator'
import { Browser } from './Browser'
import css from './App.css'

export const App = () => {
  const [draftSelection, setDraftSelection] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getRecordsRequested())
  }, [])

  return (
    <div className={css.app}>
      <Router>
        <aside className={css.aside}>
          <Navigator className={css.aside__navigation} />
          <Browser className={css.aside__browser} />
        </aside>
        <Switch>
          <Redirect exact from="/" to={routingMap.draft} />
          <Route path={routingMap.draft}>
            <div className={css.content}>
              <TextArea
                onSelect={setDraftSelection}
                placeholder="Go ahead..."
                className={css.textarea}
              />
            </div>
            <div className={css.details}>
              {draftSelection && <RecordSaver initialText={draftSelection} />}
            </div>
          </Route>
          <Route path={routingMap.explorer}>Hello from explorer!</Route>
        </Switch>
      </Router>
    </div>
  )
}
