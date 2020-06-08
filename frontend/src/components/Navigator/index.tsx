import * as React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'

import { routingMap } from '../../routing'
import PencilSvg from '../icons/pencil.svg'
import PapersSvg from '../icons/papers.svg'
import { Button } from '../common/Button'

import css from './index.css'

interface INavigatorProps {
  className: string
}

const Navigator = ({ className }: INavigatorProps) => (
  <nav className={`${css.navigator} ${className}`}>
    <Link to={routingMap.draft}>
      <Button
        className={cn(css.nav_button, css.draft)}
        onClick={console.log}
        theme="inverted"
      >
        <PencilSvg />
      </Button>
    </Link>
    <Link to={routingMap.explorer}>
      <Button
        className={cn(css.nav_button, css.reader)}
        onClick={console.log}
        theme="inverted"
      >
        <PapersSvg />
      </Button>
    </Link>
  </nav>
)

export { Navigator }
