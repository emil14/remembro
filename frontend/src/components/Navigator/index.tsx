import * as React from 'react'

import css from './index.css'

interface INavigatorProps {
  className: string
}

const Navigator = ({ className }: INavigatorProps) => (
  <div className={`${css.navigator} ${className}`}></div>
)

export { Navigator }
