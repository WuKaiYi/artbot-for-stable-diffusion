import { IconPolaroid } from '@tabler/icons-react'
import styles from './component.module.css'

interface Props {
  className: string
}

const PendingImagesPanel = ({ className = '' }: Props) => {
  return (
    <div id="image-creation-pending" className={className}>
      <h2 className="flex flex-row gap-1 items-center mb-2 font-[700] text-[18px]">
        <IconPolaroid stroke={1.5} />
        Pending images
      </h2>
      <div
        style={{
          border: '1px solid rgb(126, 90, 108)',
          padding: '8px 16px',
          borderRadius: '4px',
          height: '100vh'
        }}
      >
        <div>You have no pending image requests. Why not create something?</div>
      </div>
    </div>
  )
}

export default PendingImagesPanel
