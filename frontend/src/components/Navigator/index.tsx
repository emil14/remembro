import * as React from 'react'
import { NavLink } from 'react-router-dom'
import cn from 'classnames'

import { routingMap } from '../../routing'
import PencilSvg from '../icons/pencil.svg'
import PapersSvg from '../icons/papers.svg'
import { Button } from '../common/Button'

import css from './index.css'

interface INavigatorProps {
  className: string
}

const Navigator = ({ className }: INavigatorProps) => {
  return (
    <nav className={`${css.navigator} ${className}`}>
      <NavLink to={routingMap.draft} activeClassName={css.active_tab}>
        <Button
          className={cn(css.draft, css.nav_button)}
          onClick={console.log}
          theme="inverted"
        >
          <PencilSvg />
        </Button>
      </NavLink>
      <NavLink to={routingMap.explorer} activeClassName={css.active_tab}>
        <Button
          className={cn(css.reader, css.nav_button)}
          onClick={console.log}
          theme="inverted"
        >
          <PapersSvg />
        </Button>
      </NavLink>
    </nav>
  )
}

export { Navigator }
