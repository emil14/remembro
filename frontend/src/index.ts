async function main() {
  navigator.geolocation.getCurrentPosition(() => {
    fetch('/api/geo', { method: 'POST', body: 'some data' })
  })
  navigator.geolocation.watchPosition(() => {
    fetch('/api/geo', { method: 'POST', body: 'some data' })
  })

  let chunks: Blob[] = []
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mediaRecorder = new MediaRecorder(stream)

  mediaRecorder.onstart = () => console.info('start record...')
  mediaRecorder.ondataavailable = e => chunks.push(e.data)
  mediaRecorder.onstop = () => {
    fetch('/api/geo', { method: 'POST', body: 'some data' })
    console.info('stop recording...')
  }

  const recordBtn = document.getElementById('record_btn') as HTMLElement
  const stopRecordBtn = document.getElementById(
    'stop_record_btn'
  ) as HTMLElement

  recordBtn.onclick = () => mediaRecorder.start()
  stopRecordBtn.onclick = () => mediaRecorder.stop()
}

main()
