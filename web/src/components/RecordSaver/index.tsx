import * as React from 'react'
import { useMemo } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { format } from 'date-fns'

import { IRecordToCreate } from '../../api'
import { useSync } from '../../hooks'
import { RootState } from '../../store'
import { IFullTag } from '../../store/tags'
import { IRecordTag } from '../../store/records'
import ReminderSvg from '../icons/reminder.svg'
import ReminderSmallSvg from '../icons/reminder_small.svg'
import { TextArea } from '../shared/TextArea'
import { Button } from '../shared/Button'
import { Select } from '../shared/Select'
import { Badge } from '../shared/Badge'

import css from './index.css'

interface IRecordSaverProps {
  initialContent: string
  initialCreatedAt: string
  initialTags: IRecordTag[]
  initialReminders: string[]
  onSave(record: IRecordToCreate): void
}

export function RecordSaver(props: IRecordSaverProps) {
  const [content, setContent] = useSync(props.initialContent)
  const [addedTags, setAddedTags] = useSync(props.initialTags)
  const [addedReminders, setAddedReminders] = useSync(props.initialReminders)

  const allTags = useSelector(
    (state: RootState) => state.tags.data,
    shallowEqual
  )
  const notAddedTags = useMemo(
    () =>
      allTags.filter(tag =>
        addedTags.every(selectedTag => selectedTag.id !== tag.id)
      ),
    [allTags, addedTags]
  )

  const addTag = (tag: IFullTag) => setAddedTags(prev => [...prev, tag])

  const removeTag = (tagToRemove: IRecordTag) =>
    setAddedTags(prev => prev.filter(tag => tag.id !== tagToRemove.id))

  const saveRecord = () =>
    props.onSave({
      content,
      tagsIds: addedTags.map(tag => tag.id),
      reminders: addedReminders,
    })

  const addReminder = (reminderToAdd: string) => {
    if (!addedReminders.includes(reminderToAdd)) {
      setAddedReminders(prev => [...prev, reminderToAdd])
    }
  }

  const removeReminder = (reminderToRemove: string) =>
    setAddedReminders(prev =>
      prev.filter(reminder => reminder !== reminderToRemove)
    )

  return (
    <>
      <div className={css.header}>{props.initialCreatedAt}</div>
      <div className={css.body}>
        <TextArea
          value={content}
          onChange={setContent}
          className={css.textarea}
        />
        {addedTags.length > 0 && (
          <div className={css.tags}>
            {addedTags.map(tag => (
              <Badge
                name={`#${tag.name}`}
                onClick={() => removeTag(tag)}
                className={css.tag}
                key={tag.id}
              />
            ))}
          </div>
        )}
        {addedReminders.length > 0 && (
          <div className={css.reminders}>
            {addedReminders.map(reminder => (
              <Badge
                icon={<ReminderSmallSvg />}
                name={format(new Date(reminder), 'yyyy.mm.dd')}
                onClick={() => removeReminder(reminder)}
                className={css.reminder}
                key={reminder}
              />
            ))}
          </div>
        )}
        <div className={css.buttons}>
          <Select<{ name: string; id: number }>
            options={notAddedTags}
            valueKey="id"
            labelKey="name"
            onSelect={addTag}
            placeholder="select a tag"
            className={css.select}
          />
          <Button
            onClick={() => addReminder('2012-01-11T00:51:14Z')}
            theme="inverted"
            className={css.reminder_button}
          >
            <ReminderSvg />
          </Button>
        </div>
        <Button
          onClick={saveRecord}
          className={css.save_button}
          title="add some tags and content"
        >
          save
        </Button>
      </div>
    </>
  )
}
