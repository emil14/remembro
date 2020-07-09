import * as React from 'react'
import { useMemo, useState, useEffect, useRef } from 'react'
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
  const node = useRef(null)

  const hideInput = () => {
    setIsActive(false)
    setInputValue('')
  }

  // handle outside click
  useEffect(() => {
    const handler = (e: MouseEvent) =>
      !node.current.contains(e.target) && hideInput()
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCreate = () => {
    dispatch(createTagRequested(inputValue))
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
