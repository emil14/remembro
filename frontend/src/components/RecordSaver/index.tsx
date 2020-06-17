import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { TextArea } from '../common/TextArea'
import { Button } from '../common/Button'
import { Select } from '../common/Select'
import ReminderSvg from '../icons/reminder.svg'

import css from './index.css'
import { createRecordRequested } from '../../store/records/actions'
import { RootState } from '../../store/reducers'
import { Tag } from '../../store/tags/reducers'
import { select } from 'redux-saga/effects'

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
  useEffect(() => {
    setTextAreaValue(props.initialText)
  }, [props.initialText])

  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const tags = useSelector((state: RootState) => state.tags.data, shallowEqual)
  const handleAddTag = (tag: Tag) => setSelectedTags(prev => [...prev, tag])

  const dispatch = useDispatch()
  const handleSave = () => dispatch(createRecordRequested(textAreaValue, selectedTags.map(t => t.id))

  return (
    <>
      <TextArea
        value={textAreaValue}
        onChange={setTextAreaValue}
        className={css.textarea}
      />
      {selectedTags.length > 0 && (
        <div className={css.tags}>
          {selectedTags.map(t => (
            <span className={css.tag}>#{t.name}</span>
          ))}
        </div>
      )}
      <div className={css.buttons}>
        <Select<{ name: string; id: number }>
          options={tags}
          onSelect={handleAddTag}
          valueKey="id"
          labelKey="name"
          placeholder="select a tag"
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

export { RecordSaver }
