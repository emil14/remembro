import * as React from 'react'
import { useMemo, useState } from 'react'
import cn from 'classnames'

import css from './index.css'

interface IOption {
  value: string
  label: string
}

interface IProps<T> {
  options: Array<T>
  onSelect(value: T): void
  placeholder?: string
  className?: string
  labelKey?: string
  valueKey?: string
}

function Select<T extends Record<string, any>>(props: IProps<T>) {
  const labelKey = props.labelKey || 'label'
  const valueKey = props.valueKey || 'value'

  const options: IOption[] = useMemo(
    () =>
      props.options.map(o => ({
        label: o[labelKey],
        value: o[valueKey],
      })),
    [props.options, labelKey, valueKey]
  )

  const [selectedTag, setSelectedTag] = useState('') // empty string is value for placeholder option
  const handleChange = (value: string) => {
    const option = props.options.find(o => String(o[valueKey]) === value)
    if (option) {
      setSelectedTag(option[valueKey])
      props.onSelect(option)
    }
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
      {options.map(option => (
        <option value={option.value} className={css.option} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export { Select }
