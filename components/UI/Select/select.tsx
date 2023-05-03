import React, { CSSProperties } from 'react'
import Select, { OptionProps } from 'react-select'
import { useUID } from 'react-uid'

import { zIndex } from '../../appConstants'

import { SelectPropsComponent } from '../../types'
import './styles.css'
import { useMounted } from '../../hooks/useMounted'

const SelectComponent = (props: SelectPropsComponent) => {
  // Fixes a bunch of weird SSR related issues with react-select
  // See: https://github.com/JedWatson/react-select/issues/3590
  const uid = useUID()
  const { hasMounted } = useMounted()
  if (!hasMounted) {
    return null
  }

  const { ...rest } = props

  const customStyles = {
    container: (provided: CSSProperties) => ({
      ...provided
    }),
    control: (provided: CSSProperties) => ({
      ...provided,
      backgroundColor: `var(--input-background)`,
      borderColor: `var(--input-text)`,
      color: `var(--input-text)`,
      fontSize: '16px',
      zIndex: zIndex.DEFAULT
    }),
    input: (provided: CSSProperties) => ({
      ...provided,
      color: `var(--input-text)`
    }),
    option: (provided: CSSProperties, state: OptionProps) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#7e5a6c' : `var(--input-background)`,
      color: `var(--input-text)`
    }),
    placeholder: (provided: CSSProperties) => ({
      ...provided,
      color: '#9299a6'
    }),
    dropdownIndicator: (provided: CSSProperties) => ({
      ...provided,
      color: `var(--input-text)`
    }),
    singleValue: (provided: CSSProperties) => ({
      ...provided,
      color: `var(--input-text)`
    }),
    valueContainer: (provided: CSSProperties) => ({
      ...provided,
      color: `var(--input-text)`
    }),
    menu: (provided: CSSProperties) => ({
      ...provided,
      backgroundColor: `var(--input-background)`,
      color: `var(--input-text)`,
      zIndex: zIndex.OVER_BASE
    }),
    indicatorsContainer: (provided: CSSProperties) => ({
      ...provided
      // backgroundColor: theme.inputBackground
    })
  }

  return (
    <Select
      id={uid}
      instanceId={uid}
      classNamePrefix="select"
      closeMenuOnSelect={props.isMulti ? false : true}
      {...rest}
      //@ts-ignore
      styles={customStyles}
      placeholder="Select..."
    />
  )
}

export default SelectComponent
