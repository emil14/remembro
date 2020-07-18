import { createSelector } from 'reselect'

import { IFullTag } from './reducers'
import { RootState } from '../reducers'

// tags dict
export interface TagsDict {
  [key: string]: IFullTag
}

const tagsToDict = (tags: IFullTag[]): Readonly<TagsDict> => {
  const result: TagsDict = {}
  for (const tag of tags) {
    result[tag.name] = tag
  }
  return result
}

// tags tree
export const tagsDictSelector = createSelector(
  (state: RootState) => state.tags.data,
  tagsToDict
)

export interface TagsTreeNode extends IFullTag {
  children: TagsTreeNode[]
}

// FIXME
const tagsToTree = (tags: IFullTag[]): TagsTreeNode[] =>
  tags.reduce((acc, tag) => {
    const children = tags.filter(
      t => t.parentId.Valid && t.parentId.Int64 === tag.id
    ) // TODO
    const newTag: TagsTreeNode = { ...tag, children: tagsToTree(children) }
    return [...acc, newTag]
  }, [] as TagsTreeNode[])

export const tagsTreeSelector = createSelector(
  (state: RootState) => state.tags.data,
  tagsToTree
)
