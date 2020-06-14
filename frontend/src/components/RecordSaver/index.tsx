import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { TextArea } from '../common/TextArea'
import { Button } from '../common/Button'
import { Select } from '../common/Select'
import ReminderSvg from '../icons/reminder.svg'

import css from './index.css'
import { createRecordRequested } from '../../store/actions'

interface INoteSaverProps {
  initialText: string
}

// TODO replace with redux
const tmpTags = [
  { label: 'it', value: 'it' },
  { label: 'life', value: 'life' },
]

const RecordSaver = (props: INoteSaverProps) => {
  const [textAreaValue, setTextAreaValue] = useState(props.initialText)
  const [selectedTag, setSelectedTag] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    setTextAreaValue(props.initialText)
  }, [props.initialText])

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
          options={tmpTags}
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
      <Button
        onClick={() => dispatch(createRecordRequested(textAreaValue))}
        className={css.save_button}
      >
        save
      </Button>
    </>
  )
}

export { RecordSaver }
