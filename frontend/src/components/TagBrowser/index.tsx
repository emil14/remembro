import * as React from 'react'
import { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { tagsTreeSelector, TagsTreeNode } from '../../store/tags/selectors'
import PlusSvg from '../icons/plus.svg'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

import css from './index.css'
import { createTagRequested } from '../../store/tags/actions'

const NewTag = () => {
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dispatch = useDispatch()

  const handleCreate = () => {
    dispatch(createTagRequested(inputValue))
    setIsActive(false)
    setInputValue('')
  }

  return isActive ? (
    <>
      <input
        value={inputValue}
        onChange={e => setInputValue(e.currentTarget.value)}
      ></input>
      <Button onClick={handleCreate}>create</Button>
    </>
  ) : (
    <span className={css.new_tag} onClick={() => setIsActive(true)}>
      <PlusSvg className={css.plus_icon} />
      new tag
    </span>
  )
}

interface TagProps {
  tag: TagsTreeNode
  onClick(tag: TagsTreeNode): void
}

const Tag = (props: TagProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    props.onClick(props.tag)
  }

  return (
    <div className={css.tag} onClick={handleClick}>
      #{props.tag.name}
      {props.tag.children.map(tag => (
        <Tag tag={tag} key={tag.id} onClick={props.onClick} />
      ))}
    </div>
  )
}

interface TagBrowserProps {
  className?: string
  onSelect(ids: number[]): void
  selectedTagsIds: number[]
}

export function TagBrowser({ selectedTagsIds, onSelect }: TagBrowserProps) {
  const tree = useSelector(tagsTreeSelector)
  const selectedTags = useMemo(
    () => tree.filter(tag => selectedTagsIds.includes(tag.id)),
    [selectedTagsIds, tree]
  )

  const handleAddTag = (t: TagsTreeNode) =>
    onSelect(
      selectedTagsIds.includes(t.id)
        ? selectedTagsIds
        : [...selectedTagsIds, t.id]
    )
  const handleRemoveTag = (tagId: number) =>
    onSelect(selectedTagsIds.filter(id => id !== tagId))

  return (
    <div className={css.tags_browser}>
      {selectedTags.length > 0 && (
        <div className={css.added_tags}>
          {selectedTags.map(tag => (
            <Badge
              name={tag.name}
              key={tag.id}
              onClick={() => handleRemoveTag(tag.id)}
            />
          ))}
        </div>
      )}
      <NewTag />
      {tree.map(tag => (
        <Tag tag={tag} onClick={handleAddTag} key={tag.id} />
      ))}
    </div>
  )
}
