// Modified via: https://tabler-icons.io/

const ChevronLeftIcon = ({
  className,
  fill = 'none',
  size = 24,
  stroke = 'currentColor'
}: {
  className?: string
  fill?: string
  size?: number
  stroke?: string
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke={stroke}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="15 6 9 12 15 18"></polyline>
    </svg>
  )
}

export default ChevronLeftIcon
