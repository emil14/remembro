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
  payload: [{ id: string; content: string; created_at: string }]
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

// CREATE_RECORDS
export enum CreateRecordActionTypes {
  REQUESTED = 'CREATE_RECORD_REQUESTED',
  SUCCEEDED = 'CREATE_RECORD_SUCCEEDED',
  FAILED = 'CREATE_RECORD_FAILED',
}

export interface CreateRecordRequestedAction {
  type: typeof CreateRecordActionTypes.REQUESTED
  payload: { content: string }
}
export interface CreateRecordSucceededAction {
  type: typeof CreateRecordActionTypes.SUCCEEDED // TODO add payload
}
export interface CreateRecordFailedAction {
  type: typeof CreateRecordActionTypes.FAILED
  error: string
}

export const createRecordRequested = (
  content: string
): CreateRecordRequestedAction => ({
  type: CreateRecordActionTypes.REQUESTED,
  payload: { content },
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

// GET_TAGS
export enum GetTagsActionTypes {
  REQUESTED = 'GET_TAGS_REQUESTED',
  SUCCEEDED = 'GET_TAGS_SUCCEEDED',
  FAILED = 'GET_TAGS_FAILED',
}

export interface GetTagsRequestedAction {
  type: typeof GetTagsActionTypes.REQUESTED
}
export interface GetTagsSucceededAction {
  type: typeof GetTagsActionTypes.SUCCEEDED
  payload: [{ id: string; name: string }]
}
export interface GetTagsFailedAction {
  type: typeof GetTagsActionTypes.FAILED
  error: string
}

export const getTagsRequested = (): GetTagsRequestedAction => ({
  type: GetTagsActionTypes.REQUESTED,
})
export const getTagsSucceeded = (
  payload: [{ id: string; name: string }]
): GetTagsSucceededAction => ({
  type: GetTagsActionTypes.SUCCEEDED,
  payload,
})
export const getTagsFailed = (error: string): GetTagsFailedAction => ({
  type: GetTagsActionTypes.FAILED,
  error,
})

export type GetTagsActions =
  | GetTagsRequestedAction
  | GetTagsSucceededAction
  | GetTagsFailedAction

// CREATE_TAG
export enum CreateTagActionTypes {
  REQUESTED = 'CREATE_TAG_REQUESTED',
  SUCCEEDED = 'CREATE_TAG_SUCCEEDED',
  FAILED = 'CREATE_TAG_FAILED',
}

export interface CreateTagRequestedAction {
  type: typeof CreateTagActionTypes.REQUESTED
  payload: { content: string }
}
export interface CreateTagSucceededAction {
  type: typeof CreateTagActionTypes.SUCCEEDED // TODO add payload
}
export interface CreateTagFailedAction {
  type: typeof CreateTagActionTypes.FAILED
  error: string
}

export const createTagRequested = (
  content: string
): CreateTagRequestedAction => ({
  type: CreateTagActionTypes.REQUESTED,
  payload: { content },
})
export const createTagSucceeded = (): CreateTagSucceededAction => ({
  type: CreateTagActionTypes.SUCCEEDED,
})
export const createTagFaileed = (error: string): CreateTagFailedAction => ({
  type: CreateTagActionTypes.FAILED,
  error,
})

export type CreateTagActions =
  | CreateTagRequestedAction
  | CreateTagSucceededAction
  | CreateTagFailedAction

export type TagsActions = GetTagsActions | CreateTagActions

export type RootAction = RecordsActions | TagsActions
