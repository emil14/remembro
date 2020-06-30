import * as React from 'react'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { tagsTreeSelector, TagsTreeNode } from '../../store/tags/selectors'
import PlusSvg from '../icons/plus.svg'
import { Badge } from '../common/Badge'

import css from './index.css'

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
    [selectedTagsIds]
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
      <div className={css.added_tags}>
        {selectedTags.map(tag => (
          <Badge
            name={tag.name}
            key={tag.id}
            onClick={() => handleRemoveTag(tag.id)}
          />
        ))}
      </div>
      <span className={css.new_tag}>
        <PlusSvg className={css.plus_icon} />
        new tag
      </span>
      {tree.map(tag => (
        <Tag tag={tag} onClick={handleAddTag} key={tag.id} />
      ))}
    </div>
  )
}
