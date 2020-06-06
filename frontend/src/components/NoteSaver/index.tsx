import * as React from 'react'

import { TextArea } from '../common/TextArea'
import { Button } from '../common/Button'
import { Select } from '../common/Select'
import ReminderSvg from '../icons/reminder.svg'

import css from './index.css'

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
  const { useState, useEffect } = React
  const [textAreaValue, setTextAreaValue] = useState(props.initialText)
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    setTextAreaValue(props.initialText)
  }, [props.initialText])

  const handleSave = () =>
    props.onSave({
      text: textAreaValue,
      tag: { name: selectedTag, id: selectedTag }, // FIXME
    })

  const options = props.tags.map(tag => ({ label: tag.name, value: tag.id }))

  return (
    <>
      <TextArea
        value={textAreaValue}
        onChange={setTextAreaValue}
        className={css.textarea}
      />
      <div className={css.buttons}>
        <Select
          placeholder="select a tag"
          onSelect={setSelectedTag}
          options={options}
          className={css.select}
        />
        <Button
          onClick={console.log}
          theme="inverted"
          className={css.reminder_button}
        >
          <ReminderSvg />
        </Button>
      </div>
      <Button onClick={handleSave} className={css.save_button}>
        save
      </Button>
    </>
  )
}

export { ITag, ICreatedNote, NoteSaver }
