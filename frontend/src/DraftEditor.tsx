import * as React from 'react'
import { useState, useRef } from 'react'

interface IDraftEditorProps {
  onSelect: (selected: string) => void
}

const DraftEditor = (props: IDraftEditorProps) => {
  const [textAreaValue, setTextAreaValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleOnSelect = () => {
    if (!textareaRef.current) {
      return
    }

    const { selectionStart, selectionEnd } = textareaRef.current
    const selectedText = textAreaValue.substring(selectionStart, selectionEnd)
    if (selectedText) {
      props.onSelect(selectedText)
    }
  }

  return (
    <textarea
      value={textAreaValue}
      onChange={e => setTextAreaValue(e.currentTarget.value)}
      onSelect={handleOnSelect}
      ref={textareaRef}
    />
  )
}

export { DraftEditor }
