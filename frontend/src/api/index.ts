export const api = {
  getRecords: async () => {
    const resp = await fetch('http://localhost:3000/api/records')
    return await resp.json()
  },
  createRecords: async (content: string) => {
    await fetch('http://localhost:3000/api/records', {
      method: 'POST',
      body: JSON.stringify(content),
    })
  },
}
