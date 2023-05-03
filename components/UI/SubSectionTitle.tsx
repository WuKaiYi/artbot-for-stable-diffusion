import React from 'react'

const SubSectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center gap-2 mb-1 font-[500]">
      {children}
    </div>
  )
}

export default SubSectionTitle
