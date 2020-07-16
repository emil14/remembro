import { config } from '../config'

export const api = {
  // records
  getRecords: () => fetch(`${config.backendUrl}/records`).then(r => r.json()),
  createRecord: (content: string, tagsIds: number[]) =>
    fetch(`${config.backendUrl}/records`, {
      method: 'POST',
      body: JSON.stringify({ content, tagsIds }),
    }),
  updateRecord: (id: string, content: string, tagsIds: number[]) =>
    fetch(`${config.backendUrl}/records`, {
      method: 'PATCH',
      body: JSON.stringify({ id, content, tagsIds }),
    }),
  // tags
  getTags: async () => {
    const resp = await fetch(`${config.backendUrl}/tags`)
    return resp.json()
  },
  createTag: (name: string) =>
    fetch(`${config.backendUrl}/tags`, {
      method: 'POST',
      body: JSON.stringify(name),
    }),
}
