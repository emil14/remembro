import * as React from 'react'

interface IBrowserProps {
  className: string
}

export const Browser = (props: IBrowserProps) => (
  <div className={props.className}></div>
)
