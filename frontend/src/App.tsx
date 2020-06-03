import * as React from 'react'
import { useState } from 'react'

import { DraftEditor } from './DraftEditor'
import { NoteSaver, ICreatedNote } from './NoteSaver'
import { Navigator } from './Navigator'

import css from './App.css'

const tags = [
  { name: 'it', id: 'it' },
  { name: 'life', id: 'life' },
]

export const App = () => {
  const [draftSelection, setDraftSelection] = useState('')
  const [savedNotes, setSavedNotes] = useState<ICreatedNote[]>([])

  return (
    <div className={css.app}>
      <Navigator />

      <DraftEditor onSelect={setDraftSelection} />

      {draftSelection && (
        <NoteSaver
          tags={tags}
          initialText={draftSelection}
          onSave={(note: ICreatedNote) =>
            setSavedNotes(prev => [...prev, note])
          }
        />
      )}

      {savedNotes.map(note => (
        <>
          <div>{note.text}</div>
          <div>{note.tag.name}</div>
        </>
      ))}
    </div>
  )
}
