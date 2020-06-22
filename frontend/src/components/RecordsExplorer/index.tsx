import * as React from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { RootState } from '../../store/reducers'
import { IRecord } from '../../store/records/reducers'
import css from './index.css'

interface IRecordsExplorerProps {
  className?: string
  tagsIDs: number[]
  onSelect(r: IRecord): void
}

export function RecordsExplorer(props: IRecordsExplorerProps) {
  const records = useSelector(
    (state: RootState) => state.records.data,
    shallowEqual
  )

  return (
    <div className={css.records_explorer}>
      {records.map(record => (
        <div
          onClick={() => props.onSelect(record)}
          className={css.record}
          key={record.id}
        >
          <div className={css.record_created_at}>{record.createdAt}</div>
          <div className={css.record_content}>{record.content}</div>
          <br />
        </div>
      ))}
    </div>
  )
}
