import clsx from 'clsx'
import React from 'react'

interface IRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const Row = (props: IRowProps) => {
  const { children, className, ...rest } = props
  return (
    <div
      className={clsx(`flex flex-row w-full gap-[8px] items-center`, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Row
