import React from 'react'
import styles from './section.module.css'
import clsx from 'clsx'

const Section = ({
  first = false,
  children,
  className
}: {
  first?: boolean
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={clsx({
        [styles['section']]: !first,
        [styles['section-first']]: first,
        className
      })}
    >
      {children}
    </div>
  )
}

export default Section
