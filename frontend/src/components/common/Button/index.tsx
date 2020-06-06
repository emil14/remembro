import * as React from 'react'
import cn from 'classnames'

import css from './index.css'

interface IButtonProps {
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  className?: string
  theme?: 'normal' | 'inverted'
  children: React.ReactNode
}

const Button = (props: IButtonProps) => {
  const classNames = cn(
    css.button,
    props.className,
    css[props.theme] || css.normal
  )

  return (
    <button className={classNames} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export { Button }
