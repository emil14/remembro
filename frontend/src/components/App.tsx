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
  const { useState } = React
  const [draftSelection, setDraftSelection] = useState('')
  const [savedNotes, setSavedNotes] = useState<ICreatedNote[]>([])

  React.useEffect(() => {
    const aux = async () => {
      const res = await window.fetch('http://localhost:3000/api/records')
      console.log(res.json())
    }
    aux()
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
          <Route path="/draft">
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
                  onSave={(note: ICreatedNote) =>
                    setSavedNotes(prev => [...prev, note])
                  }
                />
              )}
            </div>
          </Route>
          <Route path="/explorer">Hello from explorer!</Route>
        </Switch>
      </Router>
    </div>
  )
}
