import { clientHeader, getApiHostServer } from '../utils/appUtils'
import { isValidHttpUrl } from '../utils/validationUtils'
import { trackEvent } from './telemetry'

interface FinishedImageResponse {
  success: boolean
  status?: string
  message?: string
  jobId?: string
  worker_name?: string
  hordeImageId?: string
  imageBlob?: Blob
  seed?: string
  canRate?: boolean
  model?: string
  worker_id?: string
}

let isCoolingOff = false

const apiCooldown = () => {
  if (isCoolingOff) {
    return
  }

  isCoolingOff = true

  setTimeout(() => {
    isCoolingOff = false
  }, 15000)
}

export const getFinishedImage = async (
  jobId: string
): Promise<FinishedImageResponse> => {
  if (isCoolingOff) {
    return {
      success: false,
      status: 'API_COOLDOWN'
    }
  }

  if (!jobId) {
    return {
      success: false,
      status: 'MISSING_JOBID'
    }
  }

  try {
    const res = await fetch(
      `${getApiHostServer()}/api/v2/generate/status/${jobId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Client-Agent': clientHeader()
        }
      }
    )

    const status = res.status
    const data = await res.json()

    const { generations, message, shared, faulted } = data

    if (message === '2 per 1 minute' || status === 429) {
      apiCooldown()
      return {
        success: false,
        status: 'WAITING_FOR_PENDING_REQUEST',
        jobId
      }
    }

    if (faulted) {
      return {
        success: false,
        status: 'WORKER_GENERATION_ERROR',
        jobId
      }
    }

    if (Array.isArray(generations) && generations.length > 0) {
      const [image] = generations

      if (!generations || !image) {
        return {
          success: false,
          status: 'WORKER_GENERATION_ERROR',
          jobId
        }
      }

      const { model, seed, id: hordeImageId, worker_id, worker_name } = image

      // Image is not done uploading to R2 yet(?).
      // This should no longer happen, according to Db0
      // Keeping this here for now.
      if (image.img === 'R2') {
        return {
          success: false,
          status: 'WAITING_FOR_PENDING_REQUEST',
          jobId
        }
      }

      let imageBlob

      if (isValidHttpUrl(image.img)) {
        try {
          const imageData = await fetch(`${image.img}`)
          imageBlob = await imageData.blob()
        } catch (err) {
          return {
            success: false,
            status: 'MISSING_IMAGE_BLOB',
            jobId
          }
        }
      }

      // Attempt to handle an error that sometimes occurs, where R2 returns an invalid response.
      // For whatever reason, ArtBot still processes this as an image.
      if (imageBlob) {
        const validImage = imageBlob instanceof Blob

        if (!validImage) {
          return {
            success: false,
            status: 'INVALID_IMAGE_FROM_API',
            jobId,
            message:
              'An error occurred while attempting to generate this image. Please try again.'
          }
        }
      }

      trackEvent({
        event: 'IMAGE_RECEIVED_FROM_API',
        data: {}
      })

      return {
        success: true,
        hordeImageId,
        jobId,
        model,
        imageBlob,
        seed,
        canRate: shared ? true : false,
        worker_id,
        worker_name
      }
    }

    return {
      success: false,
      status: 'UNKNOWN_ERROR',
      jobId
    }
  } catch (err) {
    return {
      success: false,
      status: 'UNKNOWN_ERROR',
      jobId
    }
  }
}
