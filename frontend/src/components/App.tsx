import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import format from 'date-fns/format'
import cn from 'classnames'

import { routingMap } from '../routing'
import {
  getRecordsRequested,
  createRecordRequested,
  updateRecordRequested,
} from '../store/records/actions'
import { getTagsRequested } from '../store/tags/actions'

import { TextArea } from './common/TextArea'
import { RecordSaver } from './RecordSaver'
import { Navigator } from './Navigator'
import { TagBrowser } from './TagBrowser'
import css from './App.css'
import { ErrorBoundary } from './common/ErrorBoundary'
import { RecordsExplorer } from './RecordsExplorer'
import { IRecord } from '../store/records/reducers'

export function App() {
  const [draftSelection, setDraftSelection] = useState('')
  const [selectedTagsIDs, setSelectedTagsIDs] = useState<number[]>([])
  const [selectedRecord, setSelectedRecord] = useState<IRecord | null>(null)

  const dispatch = useDispatch()
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
              <div className={cn(css.content, css.draft)}>
                <TextArea
                  onSelect={setDraftSelection}
                  placeholder="Go ahead..."
                  className={css.textarea}
                />
              </div>
              <div className={css.details}>
                {draftSelection && (
                  <RecordSaver
                    initialContent={draftSelection}
                    initialCreatedAt={format(new Date(), 'yyyy.mm.dd')}
                    initialTagsIds={[]}
                    onSave={(content, tags) =>
                      dispatch(createRecordRequested(content, tags))
                    }
                  />
                )}
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
                {selectedRecord && (
                  <RecordSaver
                    initialContent={selectedRecord.content}
                    initialCreatedAt={selectedRecord.createdAt}
                    initialTagsIds={selectedRecord.tagsIds}
                    onSave={(content, tags) =>
                      dispatch(
                        updateRecordRequested(selectedRecord.id, content, tags)
                      )
                    }
                  />
                )}
              </div>
            </Route>
          </Switch>
        </Router>
      </ErrorBoundary>
    </div>
  )
}
