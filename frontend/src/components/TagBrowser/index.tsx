import * as React from 'react'
import { useSelector } from 'react-redux'

import { tagsTreeSelector, TagsTreeNode } from '../../store/tags/selectors'
import css from './index.css'

interface IBrowserProps {
  className?: string
}

interface TagProps {
  name: string
  children: TagsTreeNode[]
}

const Tag = (props: TagProps) => (
  <div className={css.tag}>
    #{props.name}
    {props.children.map(t => (
      <Tag {...t} key={t.id} />
    ))}
  </div>
)

export function TagBrowser(props: IBrowserProps) {
  const tree = useSelector(tagsTreeSelector)

  return (
    <div className={css.tags_browser}>
      {tree.map(t => (
        <Tag {...t} key={t.id} />
      ))}
    </div>
  )
}
