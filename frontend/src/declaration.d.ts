// css modules type
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg' {
  const icon: any // TODO replace any
  export default icon
}
