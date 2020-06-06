import * as React from 'react'
import cn from 'classnames'

import PencilSvg from '../icons/pencil.svg'
import PapersSvg from '../icons/papers.svg'
import { Button } from '../common/Button'

import css from './index.css'

interface INavigatorProps {
  className: string
}

const Navigator = ({ className }: INavigatorProps) => (
  <nav className={`${css.navigator} ${className}`}>
    <Button
      className={cn(css.nav_button, css.draft)}
      onChange={console.log}
      theme="inverted"
    >
      <PencilSvg />
    </Button>
    <Button
      className={cn(css.nav_button, css.reader)}
      onChange={console.log}
      theme="inverted"
    >
      <PapersSvg />
    </Button>
  </nav>
)

export { Navigator }
