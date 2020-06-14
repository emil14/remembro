export const api = {
  getRecords: async () => {
    const resp = await fetch('http://localhost:3000/api/records')
    return await resp.json()
  },
  createRecord: async (content: string) => {
    await fetch('http://localhost:3000/api/records', {
      method: 'POST',
      body: JSON.stringify(content),
    })
  },
  getTags: async () => {
    const resp = await fetch('http://localhost:3000/api/tags')
    return await resp.json()
  },
  createTag: async (name: string) => {
    await fetch('http://localhost:3000/api/tags', {
      method: 'POST',
      body: JSON.stringify(name),
    })
  },
}
