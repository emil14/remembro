import * as React from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import css from './index.css'
import { RootState } from '../../store/reducers'

interface IRecordsExplorerProps {
  className?: string
  tagsIDs: number[]
  onSelect(r: Record): void
}

export function RecordsExplorer(props: IRecordsExplorerProps) {
  const records = useSelector(
    (state: RootState) => state.records.data,
    shallowEqual
  )

  return (
    <div className={css.records_explorer}>
      {records.map(record => (
        <div className={css.record} onClick={() => props.onSelect(record)}>
          {record.content}
          <br />
          {record.createdAt}
        </div>
      ))}
    </div>
  )
}
