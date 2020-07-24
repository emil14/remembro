import { useState, useEffect } from 'react'

export function useSync<T>(
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(initialValue)
  useEffect(() => {
    setState(initialValue)
  }, [initialValue])
  return [state, setState]
}
