import { IconInfoCircle } from '@tabler/icons-react'

const TooltipIcon = ({ id }: { id: string }) => {
  return (
    <a id={id}>
      <IconInfoCircle color="white" stroke={1.5} fill="#14B8A6" />
    </a>
  )
}

export default TooltipIcon
