import { config } from './config'

export interface IRecordToCreate {
  content: string
  tagsIds: number[]
  reminders: string[]
}

export interface IRecordToUpdate extends IRecordToCreate {
  id: number
}

interface IUserCreds {
  email: string
  password: string
}

const apiPath = `http://localhost:${config.apiPort}`

export const api = {
  getRecords: () => fetch(`${apiPath}/api/records`).then(r => r.json()),
  createRecord: (record: IRecordToCreate) =>
    fetch(`${apiPath}/api/records`, {
      method: 'POST',
      body: JSON.stringify(record),
    }),
  updateRecord: (record: IRecordToUpdate) =>
    fetch(`${apiPath}/api/records`, {
      method: 'PATCH',
      body: JSON.stringify(record),
    }),
  getTags: () => fetch(`${apiPath}/api/tags`).then(resp => resp.json()),
  createTag: (name: string) =>
    fetch(`${apiPath}/api/tags`, {
      method: 'POST',
      body: JSON.stringify(name),
    }),
  registerUser: (creds: IUserCreds) =>
    fetch(`${apiPath}/register`, {
      method: 'POST',
      body: JSON.stringify(creds),
    }),
  authorizeUser: (creds: IUserCreds) =>
    fetch(`${apiPath}/login`, {
      method: 'POST',
      body: JSON.stringify(creds),
    }),
}
