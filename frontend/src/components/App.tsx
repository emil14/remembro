import * as React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { routingMap } from '../routing'
import { TextArea } from './common/TextArea'
import { NoteSaver, ICreatedNote } from './NoteSaver'
import { Navigator } from './Navigator'
import { Browser } from './Browser'
import css from './App.css'

const tags = [
  { name: 'it', id: 'it' },
  { name: 'life', id: 'life' },
]

export const App = () => {
  const { useState, useEffect } = React
  const [draftSelection, setDraftSelection] = useState('')
  const [savedNotes, setSavedNotes] = useState<ICreatedNote[]>([])

  useEffect(() => {
    const aux = async () => {
      const res = await fetch('http://localhost:3000/api/records')
      console.log(await res.json())
    }
    aux()
  }, [])

  const putNote = async (text: string) => {
    const res = await fetch('http://localhost:3000/api/records', {
      method: 'POST',
      body: JSON.stringify(text),
    })
    alert('Success')
  }

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
              {draftSelection && (
                <NoteSaver
                  tags={tags}
                  initialText={draftSelection}
                  onSave={n => putNote(n.text)}
                />
              )}
            </div>
          </Route>
          <Route path={routingMap.explorer}>Hello from explorer!</Route>
        </Switch>
      </Router>
    </div>
  )
}
