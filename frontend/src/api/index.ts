import { config } from '../config'

const getRecords = () =>
  fetch(`${config.backendUrl}/records`).then(r => r.json())

const getTags = () =>
  fetch(`${config.backendUrl}/tags`).then(resp => resp.json())

const createTag = (name: string) =>
  fetch(`${config.backendUrl}/tags`, {
    method: 'POST',
    body: JSON.stringify(name),
  })

export interface ICreatedRecord {
  content: string
  tagsIds: number[]
  reminders: string[]
}
const createRecord = (record: ICreatedRecord) =>
  fetch(`${config.backendUrl}/records`, {
    method: 'POST',
    body: JSON.stringify(record),
  })

export interface IUpdatedRecord extends ICreatedRecord {
  id: number
}
const updateRecord = (record: IUpdatedRecord) =>
  fetch(`${config.backendUrl}/records`, {
    method: 'PATCH',
    body: JSON.stringify(record),
  })

export const api = {
  getRecords,
  createRecord,
  updateRecord,
  getTags,
  createTag,
}
