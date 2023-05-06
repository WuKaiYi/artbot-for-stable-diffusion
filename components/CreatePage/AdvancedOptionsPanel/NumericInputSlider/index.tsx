import React from 'react'
import dynamic from 'next/dynamic'

const DynamicInputSlider = dynamic(() => import('./numericInputSlider'), {
  ssr: false
})

export default function NumericInputSlider(props: any) {
  return (
    <div className="grow">
      <DynamicInputSlider {...props} />
    </div>
  )
}
