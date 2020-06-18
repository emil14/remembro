import { config } from '../config'

export const api = {
  // records
  getRecords: () => fetch(`${config.backendUrl}/records`).then(r => r.json()),
  createRecord: (content: string, tagsIds: number[]) =>
    fetch(`${config.backendUrl}/records`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        tagsIds,
      }),
    }),
  // tags
  getTags: async () => {
    const resp = await fetch(`${config.backendUrl}/tags`)
    return await resp.json()
  },
  createTag: (name: string) =>
    fetch(`${config.backendUrl}/tags`, {
      method: 'POST',
      body: JSON.stringify(name),
    }),
  // errors
  logError: async (errMsg: string) =>
    fetch(`${config.backendUrl}/errors`, {
      method: 'POST',
      body: errMsg,
    }),
}
