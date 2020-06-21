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
import { getRecordsRequested } from '../store/records/actions'
import { getTagsRequested } from '../store/tags/actions'

import { TextArea } from './common/TextArea'
import { RecordSaver } from './RecordSaver'
import { Navigator } from './Navigator'
import { TagBrowser } from './TagBrowser'
import css from './App.css'
import { ErrorBoundary } from './common/ErrorBoundary'
import { Tag } from '../store/tags/reducers'
import { RecordsExplorer } from './RecordsExplorer'

export function App() {
  const dispatch = useDispatch()
  const [draftSelection, setDraftSelection] = useState('')
  const [selectedTagsIDs, setSelectedTagsIDs] = useState<number[]>([]) // TODO move
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    dispatch(getRecordsRequested())
    dispatch(getTagsRequested())
  }, [])

  return (
    <div className={css.app}>
      <ErrorBoundary>
        <Router>
          <aside className={css.aside}>
            <Navigator className={css.aside__navigation} />
            <TagBrowser onSelect={setSelectedTagsIDs} />
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
            <Route path={routingMap.explorer}>
              <div className={css.content}>
                <RecordsExplorer
                  tagsIDs={selectedTagsIDs}
                  onSelect={setSelectedRecord}
                />
              </div>
              <div className={css.details}>
                {selectedRecord && <RecordSaver initialText={''} />}
              </div>
            </Route>
          </Switch>
        </Router>
      </ErrorBoundary>
    </div>
  )
}
