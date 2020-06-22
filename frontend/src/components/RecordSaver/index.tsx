import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { TextArea } from '../common/TextArea'
import { Button } from '../common/Button'
import { Select } from '../common/Select'
import ReminderSvg from '../icons/reminder.svg'

import { createRecordRequested } from '../../store/records/actions'
import { RootState } from '../../store/reducers'
import { Tag } from '../../store/tags/reducers'
import CloseSvg from '../icons/close.svg'
import css from './index.css'

interface IRecordSaverProps {
  initialContent: string
  initialCreatedAt: string;
  initialTagsIds: number[];
}

export function RecordSaver(props: IRecordSaverProps) {
  const dispatch = useDispatch()
  const [content, setContent] = useState(props.initialContent)
  const [selectedTagsIds, setSelectedTagsIds] = useState(props.initialTagsIds)
  
  useEffect(() => {
    setContent(props.initialContent)
  }, [props.initialContent])
  useEffect(() => {
    setSelectedTagsIds(props.initialTagsIds)
  }, [props.initialTagsIds])

  const allTags = useSelector((state: RootState) => state.tags.data, shallowEqual)
  
  const [addedTags, notAddedTags] = useMemo(() => {
    const addedTags = allTags.filter(tag => selectedTagsIds.includes(tag.id))
    const notAddedTags = allTags.filter(tag => addedTags.every(addedTag => addedTag.id !== tag.id))
    return [addedTags, notAddedTags]
  }, [allTags, selectedTagsIds])

  const handleAddTag = (tag: Tag) => setSelectedTagsIds(prev => [...prev, tag.id])
  const handleRemoveTag = (tag: Tag) => setSelectedTagsIds(prev => prev.filter(tagId => tagId !== tag.id))
  const handleSave = () => dispatch(createRecordRequested(content, selectedTagsIds)

  return (
    <>
      <div className={css.header}>
        {props.initialCreatedAt}
      </div>
      <div className={css.body}>
        <TextArea
          value={content}
          onChange={setContent}
          className={css.textarea}          
        />
        {addedTags.length > 0 && (
          <div className={css.tags}>
            {addedTags.map(t => (
              <span className={css.tag} key={t.id} title="Click to remove" onClick={() => handleRemoveTag(t)}>
                #{t.name}
                <CloseSvg className={css.close_icon} />
              </span>
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
        <Button onClick={handleSave} className={css.save_button}>
          save
        </Button>
      </div>
    </>
  )
}

