import * as React from 'react'
import cn from 'classnames'

import css from './index.css'

interface ISelectOption {
  value: string
  label: string
}

interface ISelectProps {
  options: Array<ISelectOption>
  onSelect(value: string): void
  placeholder?: string
  className: string
}

const Select = (props: ISelectProps) => {
  const [selectedTag, setSelectedTag] = React.useState('')

  const handleChange = (value: string) => {
    setSelectedTag(value)
    props.onSelect(props.options.find(o => o.name === value)) // FIXME
  }

  return (
    <select
      value={selectedTag}
      onChange={e => handleChange(e.currentTarget.value)}
      className={cn(css.select, props.className)}
    >
      <option value="" className={css.option}>
        {props.placeholder}
      </option>
      {props.options.map(option => (
        <option value={option.value} className={css.option}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export { Select }
