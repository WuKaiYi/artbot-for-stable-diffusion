/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useRouter } from 'next/router'
import PageTitle from '../components/UI/PageTitle'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { userInfoStore } from '../store/userStore'
import { logError } from '../utils/appUtils'
import styles from '../components/ErrorComponent/component.module.css'

export default function ErrorPage({ err }: { err: any }) {
  const router = useRouter()

  useEffectOnce(() => {
    const { username } = userInfoStore.state

    let errorInfo = ''

    if (err) {
      errorInfo = JSON.stringify(err, Object.getOwnPropertyNames(err))
    }

    logError({
      username,
      path: `${router.basePath}${router.asPath}`,
      errorMessage: err?.message,
      errorInfo,
      errorType: 'server-side'
    })
  })

  return (
    <div>
      <Head>
        <title>Unexpected Error - ArtBot for Stable Diffusion</title>
      </Head>
      <PageTitle>An unexpected error has occurred.</PageTitle>
      <div className="mb-[8px]">
        ArtBot encountered an error while attempting to process this request.
      </div>
      <div className="mb-[8px]">
        Otherwise, this is probably Dave&apos;s fault. An error log has
        automatically been created.
      </div>
      <div className="mb-[8px]">
        Please hit the{' '}
        <a className={styles['StyledLink']} href="/artbot/contact">
          contact form
        </a>{' '}
        if you&apos;d like to provide more information about what happened or{' '}
        <a
          className={styles['StyledLink']}
          href="https://discord.com/channels/781145214752129095/1038867597543882894"
          target="_blank"
          rel="noopener noreferrer"
        >
          visit the ArtBot channel
        </a>{' '}
        on the{' '}
        <a
          className={styles['StyledLink']}
          href="https://discord.gg/3DxrhksKzn"
          target="_blank"
          rel="noreferrer"
        >
          Stable Horde Discord server
        </a>{' '}
        .
      </div>
    </div>
  )
}
