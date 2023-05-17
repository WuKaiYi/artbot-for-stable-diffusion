/**
 * Generate a ton of mock data to fill up local IndexedDb tables for perf testing.
 */

import { JobStatus } from 'types'
import { uuidv4 } from './appUtils'
import { db, addCompletedJobToDexie } from './db'
import { base64toBlob, generateBase64Thumbnail } from './imageUtils'

import { imageString } from './mockData_image'

function getRandomElement(arr: Array<any> = []) {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

const sizes = [
  [512, 512],
  [768, 512],
  [1024, 512],
  [512, 1024]
]
const prompts = [
  'The sun sets behind the mountain, casting a warm glow over the landscape.',
  'A gentle stream flows through the valley, its tranquil waters reflecting the surrounding trees.',
  'The air is crisp and clean, with the scent of pine and wildflowers.',
  'The sky is a brilliant shade of blue, with fluffy clouds drifting lazily overhead.',
  'A family of deer graze peacefully in a nearby meadow, undisturbed by the world around them.',
  'The mountain peaks are dusted with snow, sparkling in the sunlight.',
  'A lone eagle soars high above, surveying the world below.',
  'A cozy cabin sits nestled among the trees, its smoke rising lazily from the chimney.',
  'The silence is broken only by the rustling of leaves and the occasional bird song.',
  'The trees are a riot of colors, their leaves turning shades of gold, red, and orange.',
  'The mountains seem to stretch on forever, their majesty awe-inspiring.',
  'A small waterfall cascades down the rocks, its gentle sound soothing to the soul.',
  'The landscape is a patchwork of green and brown, with occasional splashes of color.',
  'The sun filters through the trees, dappling the forest floor with light and shadow.',
  'The mountain air is invigorating, filling the lungs with a sense of peace and calm.',
  'The sky is a canvas of colors, with hues of pink, orange, and purple blending together.',
  'The valley below is shrouded in mist, giving it an ethereal quality.',
  'A family of rabbits play in the meadow, their antics bringing a smile to your face.',
  'A gentle breeze rustles the leaves, creating a soothing melody.',
  'The mountain landscape is a reminder of the beauty and majesty of nature, a peaceful oasis in a chaotic world.'
]

export function createWebpImage({ width = 512, height = 512, text = '' }) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx: any = canvas.getContext('2d')

  // Set background color to black
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Set text color to white and font properties
  ctx.fillStyle = 'white'
  ctx.font = '24px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Calculate text position and draw the text
  const textX = canvas.width / 2
  const textY = canvas.height / 2
  ctx.fillText(text, textX, textY)

  const webpDataUrl = canvas.toDataURL('image/webp')
  const [, imgString] = webpDataUrl.split(';base64,')

  return imgString
}

export const getImageObject = async ({ imageText = '', jobStatus }: any) => {
  // const [height, width]: any = getRandomElement(sizes)
  const height = 2048
  const width = 2048

  return {
    cfg_scale: 9,
    favorited:
      jobStatus === JobStatus.Done
        ? Math.random() < 0.1
          ? true
          : false
        : false,
    height,
    imageMimeType: 'image/webp',
    jobId: uuidv4(),
    jobStatus: jobStatus,
    jobTimestamp: 1684109519857,
    karras: true,
    hires: false,
    clipskip: 1,
    models: ['Deliberate'],
    modelVersion: '2',
    negative: '',
    numImages: 1,
    orientation: 'custom',
    parentJobId: '',
    post_processing: [],
    prompt: imageText + ' ' + getRandomElement(prompts),
    sampler: 'k_euler_a',
    seed: Math.abs((Math.random() * 2 ** 32) | 0),
    shareImagesExternally: true,
    source_image: '',
    source_mask: '',
    source_processing: 'prompt',
    stylePreset: 'none',
    steps: 24,
    multiSteps: [],
    multiGuidance: [],
    timestamp: Date.now(),
    tiling: false,
    triggers: [],
    useAllModels: false,
    useAllSamplers: false,
    useMultiSteps: false,
    useMultiGuidance: false,
    width,
    canvasData: null,
    maskData: null,
    initWaitTime: 8,
    wait_time: 8,
    queue_position: 0,
    done: true,
    status: 'SUCCESS',
    message: '',
    success: true,
    hordeImageId: '4b5ba369-5df0-406a-8168-31440302a689',
    model: 'Deliberate',
    base64String: '',
    // base64String: jobStatus === JobStatus.Done ? imageString() : '',
    imageBlob:
      jobStatus === JobStatus.Done
        ? await base64toBlob(imageString(), 'image/webp')
        : '',
    // base64String: createWebpImage({
    //   height,
    //   width,
    //   text: imageText
    // }),
    canRate: false,
    worker_id: 'dc0704ab-5b42-4c65-8471-561be16ad696',
    worker_name: 'The Portal of Infinite Realities'
  }
}

export const initMockData = () => {
  if (typeof window === 'undefined') {
    return
  }

  // @ts-ignore
  window.fillDb = async (numImages = 1, jobStatus = JobStatus.Done) => {
    for (let i of Array(numImages).keys()) {
      const imageDetails = await getImageObject({
        imageText: `Image #${i + 1}`,
        jobStatus
      })

      console.log(`mockData? imageDetails:`, imageDetails)

      let thumbnail = ''

      if (jobStatus === JobStatus.Done) {
        thumbnail = await generateBase64Thumbnail(
          imageDetails.imageBlob,
          uuidv4()
        )

        await addCompletedJobToDexie({ ...imageDetails, thumbnail })
      }

      if (jobStatus === JobStatus.Error) {
        await db.pending.put(Object.assign({}, imageDetails))
      }

      console.log(`Processing image ${i + 1} of ${numImages}`)
    }
  }
}
