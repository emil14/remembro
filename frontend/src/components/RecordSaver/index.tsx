import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { RootState } from '../../store/reducers'
import { Tag } from '../../store/tags/reducers'

import ReminderSvg from '../icons/reminder.svg'
import { TextArea } from '../common/TextArea'
import { Button } from '../common/Button'
import { Select } from '../common/Select'
import { Badge } from '../common/Badge'

import css from './index.css'

interface IRecordSaverProps {
  initialContent: string
  initialCreatedAt: string
  initialTagsIds: number[]
  onSave(content: string, selectedTagsIds: number[]): void
}

export function RecordSaver(props: IRecordSaverProps) {
  const [content, setContent] = useState(props.initialContent)
  const [selectedTagsIds, setSelectedTagsIds] = useState(props.initialTagsIds)

  useEffect(() => {
    setContent(props.initialContent)
  }, [props.initialContent])
  useEffect(() => {
    setSelectedTagsIds(props.initialTagsIds)
  }, [props.initialTagsIds])

  const allTags = useSelector(
    (state: RootState) => state.tags.data,
    shallowEqual
  )

  const [addedTags, notAddedTags] = useMemo(() => {
    const addedTags = allTags.filter(tag => selectedTagsIds.includes(tag.id))
    const notAddedTags = allTags.filter(tag =>
      addedTags.every(addedTag => addedTag.id !== tag.id)
    )
    return [addedTags, notAddedTags]
  }, [allTags, selectedTagsIds])

  const handleAddTag = (tag: Tag) =>
    setSelectedTagsIds(prev => [...prev, tag.id])

  const handleRemoveTag = (tag: Tag) =>
    setSelectedTagsIds(prev => prev.filter(tagId => tagId !== tag.id))

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
            {addedTags.map(t => (
              <Badge
                name={t.name}
                onClick={() => handleRemoveTag(t)}
                className={css.tag}
                key={t.id}
              />
            ))}
          </div>
        )}
        <div className={css.buttons}>
          <Select<{ name: string; id: number }>
            options={notAddedTags}
            valueKey="id"
            labelKey="name"
            onSelect={handleAddTag}
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
        <Button
          onClick={() => props.onSave(content, selectedTagsIds)}
          className={css.save_button}
        >
          save
        </Button>
      </div>
    </>
  )
}
