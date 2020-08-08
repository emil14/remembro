import * as React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import format from 'date-fns/format'
import cn from 'classnames'

import { routes } from '../routing'
import { IRecordToCreate, IUserCreds } from '../api'
import { IRecord } from '../store/records'
import { createRecord, updateRecord } from '../store/records'
import { registerUser, authorizeUser } from '../store/auth'

import { TextArea } from './shared/TextArea'
import { RecordSaver } from './RecordSaver'
import { Navigator } from './Navigator'
import { TagBrowser } from './TagBrowser'
import { ErrorBoundary } from './shared/ErrorBoundary'
import { RecordsExplorer } from './RecordsExplorer'
import css from './App.css'
import { ProtectedRoute } from './shared/ProtectedRoute'
import { Button } from './shared/Button'

const UserForm = (props: { onSubmit: (creds: IUserCreds) => unknown }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    props.onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
      />
      <input
        type="text"
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}

const AuthForm = () => {
  const dispatch = useDispatch()
  return (
    <UserForm
      onSubmit={(creds: IUserCreds) => dispatch(authorizeUser(creds))}
    />
  )
}

const RegisterForm = () => {
  const dispatch = useDispatch()
  return (
    <UserForm onSubmit={(creds: IUserCreds) => dispatch(registerUser(creds))} />
  )
}

interface IExplorerProps {
  selectedTagsIDs: number[]
  onSelect(r: IRecord): void
  selectedRecord: IRecord | null
  onRecordUpdate: () => unknown
}

const ExplorerPage = (props: IExplorerProps) => {
  const dispatch = useDispatch()
  const handleUpdateRecord = (updatedRecord: IRecordToCreate) => {
    if (props.selectedRecord) {
      dispatch(updateRecord({ ...updatedRecord, id: props.selectedRecord.id }))
      props.onRecordUpdate()
    }
  }
  return (
    <>
      <div className={css.content}>
        <RecordsExplorer
          tagsIDs={props.selectedTagsIDs}
          onSelect={props.onSelect}
        />
      </div>
      <div className={css.details}>
        {props.selectedRecord && (
          <RecordSaver
            initialContent={props.selectedRecord.content}
            initialCreatedAt={props.selectedRecord.createdAt}
            initialTags={props.selectedRecord.tags}
            initialReminders={props.selectedRecord.reminders}
            onSave={handleUpdateRecord}
          />
        )}
      </div>
    </>
  )
}

export function App() {
  const [draftSelection, setDraftSelection] = useState('')
  const [selectedTagsIDs, setSelectedTagsIDs] = useState<number[]>([])
  const [selectedRecord, setSelectedRecord] = useState<IRecord | null>(null)

  const dispatch = useDispatch()

  const handleCreateRecord = (created: IRecordToCreate) => {
    dispatch(createRecord(created))
    setDraftSelection('')
  }

  return (
    <div className={css.app}>
      <ErrorBoundary>
        <Router>
          <>
            <ProtectedRoute path="/">
              <aside className={css.aside}>
                <Navigator className={css.aside__navigation} />
                <TagBrowser
                  selectedTagsIds={selectedTagsIDs}
                  onTagsChange={setSelectedTagsIDs}
                />
              </aside>
            </ProtectedRoute>
            <Switch>
              <Redirect exact from="/" to={routes.draft} />
              <Route path={routes.auth}>
                <AuthForm />
              </Route>
              <Route path={routes.register}>
                <RegisterForm />
              </Route>
              <ProtectedRoute path={routes.draft}>
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
              </ProtectedRoute>
              <ProtectedRoute path={routes.explorer}>
                <ExplorerPage
                  selectedRecord={selectedRecord}
                  selectedTagsIDs={selectedTagsIDs}
                  onSelect={setSelectedRecord}
                  onRecordUpdate={() => setSelectedRecord(null)}
                />
              </ProtectedRoute>
            </Switch>
          </>
        </Router>
      </ErrorBoundary>
    </div>
  )
}
