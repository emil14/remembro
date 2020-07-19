import * as React from 'react'
import { useMemo, useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PlusSvg from '../icons/plus.svg'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { createTag, IFullTag } from '../../store/tags'
import { RootState } from '../../store'
import css from './index.css'

const NewTag = () => {
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dispatch = useDispatch()
  const node = useRef(null)

  const hideInput = () => {
    setIsActive(false)
    setInputValue('')
  }

  // handle outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!node?.current?.contains(e.target)) {
        hideInput()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCreate = () => {
    dispatch(createTag(inputValue))
    hideInput()
  }

  return isActive ? (
    <div ref={node}>
      <input
        autoFocus
        value={inputValue}
        onChange={e => setInputValue(e.currentTarget.value)}
      ></input>
      <Button onClick={handleCreate}>create</Button>
    </div>
  ) : (
    <span className={css.new_tag} onClick={() => setIsActive(true)}>
      <PlusSvg className={css.plus_icon} />
      new tag
    </span>
  )
}

interface TagProps {
  tag: IFullTag
  onClick(tag: IFullTag): void
}

const Tag = (props: TagProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    props.onClick(props.tag)
  }

  return (
    <div className={css.tag} onClick={handleClick}>
      #{props.tag.name}
      {/* {props.tag.children.map(tag => (
        <Tag tag={tag} key={tag.id} onClick={props.onClick} />
      ))} */}
    </div>
  )
}

interface TagBrowserProps {
  className?: string
  onTagsChange(ids: number[]): void
  selectedTagsIds: number[]
}

export function TagBrowser({ selectedTagsIds, onTagsChange }: TagBrowserProps) {
  const { data: tags } = useSelector((state: RootState) => state.tags)
  const selectedTags = useMemo(
    () => tags.filter(tag => selectedTagsIds.includes(tag.id)),
    [selectedTagsIds, tags]
  )

  const handleAddTag = (tag: IFullTag) => {
    if (!selectedTagsIds.includes(tag.id)) {
      onTagsChange([...selectedTagsIds, tag.id])
    }
  }

  const handleRemoveTag = (tagId: number) =>
    onTagsChange(selectedTagsIds.filter(id => id !== tagId))

  return (
    <div className={css.tags_browser}>
      {selectedTags.length > 0 && (
        <div className={css.added_tags}>
          {selectedTags.map(tag => (
            <Badge
              name={`#${tag.name}`}
              key={tag.id}
              onClick={() => handleRemoveTag(tag.id)}
            />
          ))}
        </div>
      )}
      <NewTag />
      {tags.map(tag => (
        <Tag tag={tag} onClick={handleAddTag} key={tag.id} />
      ))}
    </div>
  )
}
