// GET_RECORDS
export enum GetRecordsActionTypes {
  REQUESTED = 'GET_RECORDS_REQUESTED',
  SUCCEEDED = 'GET_RECORDS_SUCCEEDED',
  FAILED = 'GET_RECORDS_FAILED',
}

export interface GetRecordsRequestedAction {
  type: typeof GetRecordsActionTypes.REQUESTED
}
export interface GetRecordsSucceededAction {
  type: typeof GetRecordsActionTypes.SUCCEEDED
  payload: [{ id: number; content: string; created_at: string }]
}
export interface GetRecordsFailedAction {
  type: typeof GetRecordsActionTypes.FAILED
  error: string
}

export const getRecordsRequested = (): GetRecordsRequestedAction => ({
  type: GetRecordsActionTypes.REQUESTED,
})
export const getRecordsSucceeded = (payload): GetRecordsSucceededAction => ({
  type: GetRecordsActionTypes.SUCCEEDED,
  payload,
})
export const getRecordsFailed = (error: string): GetRecordsFailedAction => ({
  type: GetRecordsActionTypes.FAILED,
  error,
})

export type GetRecordsActions =
  | CreateRecordRequestedAction
  | GetRecordsSucceededAction
  | GetRecordsFailedAction

// CREATE_RECORD
export enum CreateRecordActionTypes {
  REQUESTED = 'CREATE_RECORD_REQUESTED',
  SUCCEEDED = 'CREATE_RECORD_SUCCEEDED',
  FAILED = 'CREATE_RECORD_FAILED',
}

export interface CreateRecordRequestedAction {
  type: typeof CreateRecordActionTypes.REQUESTED
  payload: { content: string; tagsIds: number[] }
}
export interface CreateRecordSucceededAction {
  type: typeof CreateRecordActionTypes.SUCCEEDED // TODO add payload
}
export interface CreateRecordFailedAction {
  type: typeof CreateRecordActionTypes.FAILED
  error: string
}

export const createRecordRequested = (
  content: string,
  tagsIds: number[]
): CreateRecordRequestedAction => ({
  type: CreateRecordActionTypes.REQUESTED,
  payload: { content, tagsIds },
})
export const createRecordSucceeded = (): CreateRecordSucceededAction => ({
  type: CreateRecordActionTypes.SUCCEEDED,
})
export const createRecordFaileed = (
  error: string
): CreateRecordFailedAction => ({
  type: CreateRecordActionTypes.FAILED,
  error,
})

export type CreateRecordActions =
  | CreateRecordRequestedAction
  | CreateRecordSucceededAction
  | CreateRecordFailedAction

export type RecordsActions = GetRecordsActions | CreateRecordActions
