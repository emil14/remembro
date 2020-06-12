// css modules type
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
