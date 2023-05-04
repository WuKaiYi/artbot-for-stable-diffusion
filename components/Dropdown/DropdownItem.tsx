import React from 'react'
import styles from './dropdownItem.module.css'

interface DropdownItemContentProps {
  active?: boolean
  children?: React.ReactNode
  disabled?: boolean
  open?: boolean
  onClick?: () => void
  width?: string
}

export function DropdownItem(props: DropdownItemContentProps) {
  const { children, ...rest } = props
  return (
    <li className={styles['StyledDropdownItem']} {...rest}>
      {children}
    </li>
  )
}
