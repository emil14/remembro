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
import { ICreatedRecord } from '../api'
import { IRecord } from '../store/records'
import { fetchRecords, createRecord, updateRecord } from '../store/records'
import { fetchTags } from '../store/tags'

import { TextArea } from './shared/TextArea'
import { RecordSaver } from './RecordSaver'
import { Navigator } from './Navigator'
import { TagBrowser } from './TagBrowser'
import { ErrorBoundary } from './shared/ErrorBoundary'
import { RecordsExplorer } from './RecordsExplorer'
import css from './App.css'

export function App() {
  const [draftSelection, setDraftSelection] = useState('')
  const [selectedTagsIDs, setSelectedTagsIDs] = useState<number[]>([])
  const [selectedRecord, setSelectedRecord] = useState<IRecord | null>(null)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchRecords())
    dispatch(fetchTags())
  }, [])

  const handleCreateRecord = (created: ICreatedRecord) => {
    dispatch(createRecord(created))
    setDraftSelection('')
  }
  const handleUpdateRecord = (updatedRecord: ICreatedRecord) => {
    if (selectedRecord) {
      dispatch(updateRecord({ id: selectedRecord.id, ...updatedRecord }))
      setSelectedRecord(null)
    }
  }

  return (
    <div className={css.app}>
      <ErrorBoundary>
        <Router>
          <aside className={css.aside}>
            <Navigator className={css.aside__navigation} />
            <TagBrowser
              selectedTagsIds={selectedTagsIDs}
              onTagsChange={setSelectedTagsIDs}
            />
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
                    initialTags={[]}
                    initialReminders={[]}
                    onSave={handleCreateRecord}
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
                    initialTags={selectedRecord.tags}
                    initialReminders={selectedRecord.reminders}
                    onSave={handleUpdateRecord}
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
