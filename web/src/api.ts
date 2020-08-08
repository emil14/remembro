import { config } from './config'

export interface IRecordToCreate {
  content: string
  tagsIds: number[]
  reminders: string[]
}

export interface IRecordToUpdate extends IRecordToCreate {
  id: number
}

export interface IUserCreds {
  email: string
  password: string
}

const apiPath = `http://localhost:${config.apiPort}`

const httpClient = (input: RequestInfo, init: RequestInit = {}) => {
  return fetch(input, {
    ...init,
    headers: [['Authorization', localStorage.getItem('token') || '']],
  })
}

export const api = {
  getRecords: () => httpClient(`${apiPath}/api/records`).then(r => r.json()),
  createRecord: (record: IRecordToCreate) =>
    httpClient(`${apiPath}/api/records`, {
      method: 'POST',
      body: JSON.stringify(record),
    }),
  updateRecord: (record: IRecordToUpdate) =>
    httpClient(`${apiPath}/api/records`, {
      method: 'PATCH',
      body: JSON.stringify(record),
    }),
  getTags: () => httpClient(`${apiPath}/api/tags`).then(resp => resp.json()),
  createTag: (name: string) =>
    httpClient(`${apiPath}/api/tags`, {
      method: 'POST',
      body: JSON.stringify(name),
    }),
  registerUser: (creds: IUserCreds) =>
    httpClient(`${apiPath}/register`, {
      method: 'POST',
      body: JSON.stringify(creds),
    }),
  authorizeUser: (creds: IUserCreds) =>
    httpClient(`${apiPath}/login`, {
      method: 'POST',
      body: JSON.stringify(creds),
    }),
}
