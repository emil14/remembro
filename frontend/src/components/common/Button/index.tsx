import * as React from 'react'
import cn from 'classnames'

import css from './index.css'

interface IButtonProps {
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  className?: string
  theme?: 'normal' | 'inverted'
  children: React.ReactNode
  disabled?: boolean
  title?: string
}

const Button = (props: IButtonProps) => {
  const classNames = cn(
    css.button,
    props.className,
    css[props.theme || 'normal'],
    { [css.disabled]: props.disabled }
  )

  return (
    <button
      className={classNames}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
    >
      {props.children}
    </button>
  )
}

export { Button }
