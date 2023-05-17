/* eslint-disable @next/next/no-img-element */

import React from 'react'

const ImageV2 = ({ className, image, isHero = false, style }: any) => {
  if (typeof window === 'undefined') {
    return null
  }

  let imageSrc

  const objectURL = window.URL || window.webkitURL

  if (isHero && image.imageBlob) {
    imageSrc = objectURL.createObjectURL(image.imageBlob)
  } else if (isHero && image.base64String) {
    imageSrc = 'data:image/webp;base64,' + image.base64String
  } else if (image && image.thumbnail instanceof Blob) {
    imageSrc = objectURL.createObjectURL(image.thumbnail)
  } else {
    imageSrc =
      'data:image/webp;base64,' + (image.thumbnail || image.base64String)
  }

  return (
    <img
      id={'image_' + image.id}
      className={className}
      src={imageSrc}
      loading="lazy"
      style={{
        ...style,
        borderRadius: '4px',
        width: '100%',
        display: 'block'
      }}
      alt={image.prompt}
    />
  )
}

function areEqual(prevProps: any, nextProps: any) {
  if (prevProps.image.jobId !== nextProps.image.jobId) {
    return false
  }

  return true
}

export default React.memo(ImageV2, areEqual)
