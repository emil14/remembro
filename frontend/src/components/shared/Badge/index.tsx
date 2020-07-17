import * as React from 'react'
import cn from 'classnames'

import CloseSvg from '../../icons/close.svg'
import css from './index.css'

interface IBadgeProps {
  name: string
  onClick?(): void
  className?: string
}

export function Badge(props: IBadgeProps) {
  return (
    <span
      className={cn(css.badge, props.className)}
      title="Click to remove"
      onClick={props.onClick}
    >
      #{props.name}
      {props.onClick && <CloseSvg className={css.close_icon} />}
    </span>
  )
}
