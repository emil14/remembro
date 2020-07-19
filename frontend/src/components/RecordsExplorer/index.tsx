import * as React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import format from 'date-fns/format'

import ReminderSVG from '../icons/reminder.svg'
import { RootState } from '../../store'
import { IRecord } from '../../store/records'
import css from './index.css'
import { Badge } from '../shared/Badge'

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
          <div className={css.record_created_at}>
            {format(new Date(record.createdAt), 'yyyy.mm.dd')}
          </div>
          <div className={css.record_content}>{record.content}</div>
          <div className={css.tags}>
            {record.tags.map(tag => (
              <Badge name={`#${tag.name}`} className={css.tag} key={tag.id} />
            ))}
          </div>
          {record.reminders && (
            <div className={css.reminders}>
              {record.reminders.map(reminder => (
                <div className={css.reminder} key={reminder.id}>
                  <ReminderSVG className={css.reminderIcon} />
                  {format(new Date(reminder.time), 'yyyy.mm.dd')}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
