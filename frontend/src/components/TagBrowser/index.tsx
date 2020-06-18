import * as React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { RootState } from '../../store/reducers'

interface IBrowserProps {
  className?: string
}

export function TagBrowser(props: IBrowserProps) {
  const tags = useSelector((state: RootState) => state.tags.data, shallowEqual)
  return <div className={props.className}>{tags.map(t => t.name)}</div>
}
