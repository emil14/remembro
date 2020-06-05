import * as React from 'react'
import cn from 'classnames'

import css from './index.css'

interface ITextAreaProps {
  value?: string
  placeholder?: string
  className?: string
  onChange(value: string): void
  onSelect?(selected: string): void
}

const TextArea = (props: ITextAreaProps) => {
  const { useState, useRef, useEffect } = React
  const [textAreaValue, setTextAreaValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (props.value !== undefined && props.value !== textAreaValue) {
      setTextAreaValue(props.value)
    }
  }, [props.value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.currentTarget.value)
    props.onChange(e.currentTarget.value)
  }

  const handleOnSelect = () => {
    if (props.onSelect && textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current
      const selectedText = textAreaValue.substring(selectionStart, selectionEnd)
      if (selectedText) {
        props.onSelect(selectedText)
      }
    }
  }

  return (
    <textarea
      value={textAreaValue}
      onChange={handleChange}
      onSelect={props.onSelect && handleOnSelect}
      placeholder={props.placeholder}
      ref={textareaRef}
      className={cn(css.draft_editor, props.className)}
    />
  )
}

export { TextArea }
