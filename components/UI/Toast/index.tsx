/* eslint-disable @next/next/no-img-element */
import { useSwipeable } from 'react-swipeable'

import {
  setNewImageReady,
  setShowImageReadyToast
} from '../../../store/appStore'
import { useEffect, useState } from 'react'
import { trackEvent, trackGaEvent } from '../../../api/telemetry'
import { getImageDetails } from '../../../utils/db'
import ImageSquare from '../../ImageSquare'
import CloseIcon from '../../icons/CloseIcon'
import Linker from './../Linker'
import AppSettings from 'models/AppSettings'
import styles from './toast.module.css'
import clsx from 'clsx'

export default function Toast({
  handleClose,
  handleImageClick,
  jobId,
  showImageReadyToast
}: any) {
  const handlers = useSwipeable({
    onSwipedRight: () => {
      handleClose()
    },
    onSwipedUp: () => {
      handleClose()
    },
    preventScrollOnSwipe: true,
    swipeDuration: 250,
    trackTouch: true,
    delta: 35
  })

  const [imageDetails, setImageDetails] = useState({})

  const fetchImageDetails = async (jobId: string) => {
    const details = await getImageDetails(jobId)
    setImageDetails(details)
  }

  const handleClick = () => {
    trackEvent({
      event: 'NEW_IMAGE_TOAST_CLICK'
    })
    trackGaEvent({
      action: 'toast_click',
      params: {
        type: 'new_img'
      }
    })
    handleImageClick()

    setShowImageReadyToast(false)
    setNewImageReady('')
    handleClose()
  }

  useEffect(() => {
    if (jobId) {
      fetchImageDetails(jobId)
    }
  }, [jobId])

  useEffect(() => {
    const interval = setTimeout(async () => {
      handleClose()
    }, 5000)
    return () => clearInterval(interval)
  })

  const isActive =
    // @ts-ignore
    jobId && imageDetails && imageDetails.base64String && showImageReadyToast

  if (!isActive || AppSettings.get('disableNewImageNotification')) {
    return null
  }

  return (
    <div
      className={clsx(styles['StyledToast'], {
        [styles['ActiveToast']]: isActive
      })}
      {...handlers}
    >
      {isActive && (
        <>
          <div>
            <Linker
              disableLinkClick
              href={`/image/${jobId}`}
              onClick={handleClick}
            >
              <ImageSquare
                // @ts-ignore
                imageDetails={imageDetails}
                size={80}
              />
            </Linker>
          </div>
          <div className={styles['StyledTextPanel']}>
            <div>Your new image is ready.</div>
            <Linker
              disableLinkClick
              href={`/image/${jobId}`}
              onClick={handleClick}
            >
              Check it out!
            </Linker>
          </div>
          <div className={styles['StyledClose']} onClick={handleClose}>
            <CloseIcon />
          </div>
        </>
      )}
    </div>
  )
}
