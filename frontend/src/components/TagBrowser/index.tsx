import * as React from 'react'
import { useSelector } from 'react-redux'

import { tagsTreeSelector, TagsTreeNode } from '../../store/tags/selectors'
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
}

export function TagBrowser(props: TagBrowserProps) {
  const tree = useSelector(tagsTreeSelector)

  return (
    <div className={css.tags_browser}>
      {tree.map(tag => (
        <Tag tag={tag} onClick={t => props.onSelect([t.id])} key={tag.id} />
      ))}
    </div>
  )
}
