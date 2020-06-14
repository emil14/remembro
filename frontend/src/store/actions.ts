import { RecordsActions } from './records/actions'
import { TagsActions } from './tags/actions'

export type RootAction = RecordsActions | TagsActions
