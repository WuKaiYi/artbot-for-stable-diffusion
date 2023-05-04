import React from 'react'

interface TextProps {
  children?: React.ReactNode
}

const Text = (props: TextProps) => {
  return (
    <div
      style={{
        fontSize: '18px',
        lineHeight: '28px',
        marginBottom: '20px'
      }}
    >
      {props.children}
    </div>
  )
}

export default Text
