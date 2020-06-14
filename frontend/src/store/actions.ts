// GET_RECORDS
export enum GetRecordsActionTypes {
  GET_RECORDS_REQUESTED = 'GET_RECORDS_REQUESTED',
  GET_RECORDS_SUCCEEDED = 'GET_RECORDS_SUCCEEDED',
  GET_RECORDS_FAILED = 'GET_RECORDS_FAILED',
}

export interface GetRecordsRequestedAction {
  type: GetRecordsActionTypes.GET_RECORDS_REQUESTED
}
export interface GetRecordsSucceededAction {
  type: GetRecordsActionTypes.GET_RECORDS_SUCCEEDED
  payload: [{ id: string; content: string; created_at: string }]
}
export interface GetRecordsFailedAction {
  type: GetRecordsActionTypes.GET_RECORDS_FAILED
  error: string
}
export type GetRecordsActions =
  | GetRecordsRequestedAction
  | GetRecordsSucceededAction
  | GetRecordsFailedAction

export const getRecordsRequested = (): GetRecordsRequestedAction => ({
  type: GetRecordsActionTypes.GET_RECORDS_REQUESTED,
})
export const getRecordsSuccessed = (
  payload: [{ id: string; content: string; created_at: string }]
): GetRecordsSucceededAction => ({
  type: GetRecordsActionTypes.GET_RECORDS_SUCCEEDED,
  payload,
})
export const getRecordsFaileed = (error: string): GetRecordsFailedAction => ({
  type: GetRecordsActionTypes.GET_RECORDS_FAILED,
  error,
})

// CREATE_RECORDS
export enum CreateRecordActionTypes {
  CREATE_RECORD_REQUESTED = 'CREATE_RECORD_REQUESTED',
  CREATE_RECORD_SUCCEEDED = 'CREATE_RECORD_SUCCEEDED',
  CREATE_RECORD_FAILED = 'CREATE_RECORD_FAILED',
}

export interface CreateRecordRequestedAction {
  type: CreateRecordActionTypes.CREATE_RECORD_REQUESTED
  payload: { content: string }
}
export interface CreateRecordSucceededAction {
  type: CreateRecordActionTypes.CREATE_RECORD_SUCCEEDED // TODO add payload
}
export interface CreateRecordFailedAction {
  type: CreateRecordActionTypes.CREATE_RECORD_FAILED
  error: string
}
export type CreateRecordActions =
  | CreateRecordRequestedAction
  | CreateRecordSucceededAction
  | CreateRecordFailedAction

export const createRecordsRequested = (
  content: string
): CreateRecordRequestedAction => ({
  type: CreateRecordActionTypes.CREATE_RECORD_REQUESTED,
  payload: { content },
})
export const createRecordSuccessed = (): CreateRecordSucceededAction => ({
  type: CreateRecordActionTypes.CREATE_RECORD_SUCCEEDED,
})
export const createRecordFaileed = (
  error: string
): CreateRecordFailedAction => ({
  type: CreateRecordActionTypes.CREATE_RECORD_FAILED,
  error,
})

export type RootAction = GetRecordsActions | CreateRecordActions
