import {
  TagsActions,
  GetTagsActionTypes,
  CreateTagActionTypes,
} from './actions'

export interface Tag {
  id: string
  name: string
}

export interface TagsState {
  loading: boolean
  data: Tag[]
  error: string | null
}

const initialTagsState: TagsState = {
  loading: false,
  data: [],
  error: null,
}

export function tagsReducer(
  state: TagsState = initialTagsState,
  action: TagsActions
): TagsState {
  switch (action.type) {
    case GetTagsActionTypes.REQUESTED:
    case CreateTagActionTypes.REQUESTED:
      return { data: state.data, loading: true, error: state.error }
    case GetTagsActionTypes.FAILED:
    case CreateTagActionTypes.FAILED:
      return { data: state.data, loading: false, error: action.error }
    case GetTagsActionTypes.SUCCEEDED:
      return { data: action.payload, loading: false, error: null }
    case CreateTagActionTypes.SUCCEEDED:
      return { data: state.data, loading: false, error: null }
    default:
      return state
  }
}
