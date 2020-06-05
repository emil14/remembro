import * as React from 'react'
import cn from 'classnames'
import css from './index.css'

interface IButtonProps {
  title: string
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  classname?: string
}

const Button = (props: IButtonProps) => {
  return (
    <button className={cn(css.button, props.classname)} onClick={props.onClick}>
      {props.title}
    </button>
  )
}

export { Button }
