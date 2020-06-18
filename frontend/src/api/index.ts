export const api = {
  getRecords: async () => {
    const resp = await fetch(
      `http://localhost:${process.env.BACKEND_PORT}/api/records`
    )
    return await resp.json()
  },
  createRecord: async (content: string, tagsIds: number[]) => {
    await fetch(`http://localhost:${process.env.BACKEND_PORT}/api/records`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        tagsIds,
      }),
    })
  },
  getTags: async () => {
    const resp = await fetch(
      `http://localhost:${process.env.BACKEND_PORT}/api/tags`
    )
    return await resp.json()
  },
  createTag: async (name: string) => {
    await fetch(`http://localhost:${process.env.BACKEND_PORT}/api/tags`, {
      method: 'POST',
      body: JSON.stringify(name),
    })
  },
}
