import * as React from 'react'
import { useState, useEffect } from 'react'

interface ITag {
  id: string
  name: string
}

interface INoreSaverProps {
  initialText: string
  tags: ITag[]
  onSave: (note: ICreatedNote) => void
}

interface ICreatedNote {
  text: string
  tag: ITag
}

const NoteSaver = (props: INoreSaverProps) => {
  const [textAreaValue, setTextAreaValue] = useState(props.initialText)
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    setTextAreaValue(props.initialText)
  }, [props.initialText, textAreaValue])

  const handleSave = () =>
    props.onSave({
      text: textAreaValue,
      tag: { name: selectedTag, id: selectedTag }, // FIXME
    })

  return (
    <>
      <textarea
        value={textAreaValue}
        onChange={e => setTextAreaValue(e.currentTarget.value)}
      />
      <select
        value={selectedTag}
        onChange={e => setSelectedTag(e.currentTarget.value)}
      >
        <option value="">select tag</option>
        {props.tags.map(tag => (
          <option value={tag.id} key={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
      <button onClick={handleSave}>save</button>
    </>
  )
}

export { ITag, ICreatedNote, NoteSaver }
