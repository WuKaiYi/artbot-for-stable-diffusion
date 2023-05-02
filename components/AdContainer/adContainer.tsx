import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const AD_BLOCK_ID = 'carbonads'

function AdContainer({
  code = 'CWYD62QI',
  placement = 'tinybotsnet'
}: {
  code: string
  placement: string
  minSize?: number
  maxSize?: number
  override?: false
}) {
  const router = useRouter()
  const reference = useRef<HTMLInputElement | undefined>()

  const createAd = () => {
    if (document.getElementById('carbonads')) {
      return
    }

    if (
      typeof reference === 'undefined' ||
      typeof reference.current === 'undefined' ||
      !reference ||
      !reference.current
    ) {
      return
    }

    reference.current.innerHTML = ''
    const s = document.createElement('script')
    s.id = '_carbonads_js'
    s.src = `//cdn.carbonads.com/carbon.js?serve=${code}&placement=${placement}`
    reference.current.appendChild(s)
  }

  const removeAd = () => {
    var element = document.getElementById(AD_BLOCK_ID)

    if (element?.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      removeAd()
      createAd()
    }, 200)
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname])

  const classes = ['flex', 'justify-center', 'my-2', `w-full`]

  if (typeof window === 'undefined') {
    return null
  }

  return (
    <div
      id="_adUnit"
      className={clsx(classes)}
      //@ts-ignore
      ref={reference}
    />
  )
}

export default React.memo(AdContainer)
