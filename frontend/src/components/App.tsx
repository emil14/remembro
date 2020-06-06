import * as React from 'react'

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

  return (
    <div className={css.app}>
      <aside className={css.aside}>
        <Navigator className={css.aside__navigation} />
        <Browser className={css.aside__browser} />
      </aside>
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
    </div>
  )
}
