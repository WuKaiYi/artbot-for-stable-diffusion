/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'

interface ImageDetails {
  base64String: string
  thumbnail: string
  prompt?: string
}

interface ImageSquareProps {
  imageDetails: ImageDetails
  size?: number
  id?: string
  imageType?: string
}

export default function ImageSquare({
  imageDetails,
  size = 180,
  id,
  imageType = 'image/webp'
}: ImageSquareProps) {
  if (typeof window === 'undefined') {
    return null
  }

  let imageSrc

  if (imageDetails.thumbnail instanceof Blob) {
    const objectURL = window.URL || window.webkitURL
    imageSrc = objectURL.createObjectURL(imageDetails.thumbnail)
  } else {
    imageSrc =
      'data:image/webp;base64,' +
      (imageDetails.thumbnail || imageDetails.base64String)

    if (!imageType) {
      imageSrc = `data:image/webp;base64,${
        imageDetails.thumbnail || imageDetails.base64String
      }`
    }
  }

  const classes = ['overflow-hidden', 'relative']

  return (
    <div
      className={clsx(classes)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative'
      }}
    >
      <img
        // fill
        id={id}
        src={imageSrc}
        alt={imageDetails?.prompt || ''}
        loading="lazy"
        className="mx-auto rounded"
        style={{
          objectFit: 'cover',
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </div>
  )
}
