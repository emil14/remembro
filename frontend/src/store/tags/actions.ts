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
