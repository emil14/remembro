import * as React from 'react'
import cn from 'classnames'

import CloseSvg from '../../icons/close.svg'
import css from './index.css'

interface IBadgeProps {
  name: string
  className?: string
  icon?: React.ReactElement
  onClick?(): void
}

export function Badge(props: IBadgeProps) {
  return (
    <span
      className={cn(css.badge, props.className, css['theme'])}
      title="Click to remove"
      onClick={props.onClick}
    >
      {props.icon && <span className={css.icon}>{props.icon}</span>}
      {props.name}
      {props.onClick && <CloseSvg className={css.close_icon} />}
    </span>
  )
}
