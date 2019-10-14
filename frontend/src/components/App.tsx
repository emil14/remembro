import React, { useState } from "react";

interface AppProps {}

function App(props: AppProps): any {
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.log("error");
    }
  };

  return <button onClick={startRecording}>record</button>;
}

export default App;
