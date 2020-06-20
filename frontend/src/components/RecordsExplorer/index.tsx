import * as React from 'react'
import { useSelector } from 'react-redux'

import css from './index.css'
import { RootState } from '../../store/reducers'

interface IRecordsExplorerProps {
  className?: string
}

export function RecordsExplorer(props: IRecordsExplorerProps) {
  const records = useSelector((state: RootState) => state.records.data)

  return (
    <div className={css.records_explorer}>
      {records.map(record => (
        <div className={css.record}>
          {record.content}
          {record.content}
        </div>
      ))}
    </div>
  )
}
