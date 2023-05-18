// @ts-nocheck

import { db } from './db'
// Reader parses zip files, Writer builds zip files
import { Reader, Writer } from '@transcend-io/conflux'
import AppSettings from 'models/AppSettings'
import streamSaver from 'streamsaver'

let imageId = 1

const getImageData = async () => {
  let images = await db.completed
    .where('id')
    .aboveOrEqual(imageId)
    .limit(2)
    .toArray()

  console.log(`images? ${imageId}`, images)
  let [imgToAdd, nextImage] = images

  let fileType = AppSettings.get('imageDownloadFormat') || 'jpg'
  let filename = `image_${imgToAdd.jobId}.${fileType}`

  const blob = imgToAdd.imageBlob

  if (!blob) {
    return [, , nextImage]
  }

  console.log(`blob?`, blob)

  // const res = await fetch(
  //   `data:image/${fileType};base64,` + imgToAdd.base64String
  // )
  const stream = () => blob.stream

  imageId++
  return [filename, stream, nextImage]
}

export const getZipData = async () => {
  const myReadable = new ReadableStream({
    async pull(controller) {
      const [filename, stream, nextImage] = await getImageData()

      controller.enqueue({
        name: filename,
        stream
      })

      if (!nextImage) {
        return controller.close()
      }
    }
  })

  myReadable
    .pipeThrough(new Writer())
    .pipeTo(streamSaver.createWriteStream('artbot-images.zip'))
}

/**
export const getZipDataV2 = async () => {
  const fileStream = streamSaver.createWriteStream('artbot-images.zip')

  let imageId = 1

  const readableZipStream = new ZIP({
    start(ctrl: any) {
      console.log(`Starting something...`)
    },
    async pull(ctrl: any) {
      let images = await db.completed
        .where('id')
        .aboveOrEqual(imageId)
        .limit(2)
        .toArray()

      console.log(`images? ${imageId}`, images)
      imageId++
      let [imgToAdd, nextImage] = images

      let fileType = AppSettings.get('imageDownloadFormat') || 'jpg'
      let filename = `image_${imgToAdd.jobId}.${fileType}`
      // const imgBlob = await base64toBlob(
      //   imgToAdd.base64String,
      //   `image/${fileType}`
      // )

      let res
      let stream
      try {
        res = await fetch(
          `data:image/${fileType};base64,` + imgToAdd.base64String
        )
        stream = () => res.body
        console.log(`filename?`, filename)

        ctrl.enqueue({ name: filename, stream })
      } catch (err) {
        console.log(`err m`, err.message)
      }

      if (!nextImage) {
        ctrl.close()
      } else {
        console.log(`cleanup?`)
        res = null
        stream = null
        images = null
        imgToAdd = null
        nextImage = ''
        // await sleep(250)
      }
    }
  })

  if (window.WritableStream && readableZipStream.pipeTo) {
    return readableZipStream
      .pipeTo(fileStream)
      .then(() => console.log('done writing'))
  }

  // const writer = fileStream.getWriter()
  // const reader = readableZipStream.getReader()
  // const pump = async (): Promise<void> => {
  //   let res = await reader.read()

  //   if (res.done) {
  //     return await writer.close()
  //   } else {
  //     await writer.write(res.value)
  //     return pump()
  //   }
  // }

  // pump()
}
*/
