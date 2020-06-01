import * as React from 'react'
import { useState } from 'react'
import { render } from 'react-dom'

import { DraftEditor } from './DraftEditor'
import { NoteSaver, ICreatedNote } from './NoteSaver'

const tags = [
  { name: 'it', id: 'it' },
  { name: 'life', id: 'life' },
]

const App = () => {
  const [draftSelection, setDraftSelection] = useState('')
  const [savedNotes, setSavedNotes] = useState<ICreatedNote[]>([])

  return (
    <>
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
    </>
  )
}

render(<App />, document.getElementById('root') as HTMLElement)
