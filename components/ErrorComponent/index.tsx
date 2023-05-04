import Head from 'next/head'
import React from 'react'
import { userInfoStore } from '../../store/userStore'
import { logError } from '../../utils/appUtils'
import PageTitle from '../UI/PageTitle'
import { db } from 'utils/db'
import styles from './component.module.css'

export const logErrorInComponent = (
  error: Error,
  info: { componentStack: string },
  componentName?: string
) => {
  const { username } = userInfoStore.state
  const errorMessage = []

  if (componentName) {
    errorMessage.push(`Component: ${componentName}`)
  }

  if (error?.message) {
    errorMessage.push(error.message)
  }

  logError({
    path: window.location.href,
    errorMessage: errorMessage.join('\n'),
    errorInfo: info?.componentStack,
    errorType: 'client-side',
    username
  })

  if (
    window.location.href.includes('/pending') &&
    errorMessage.includes(
      'The operation failed for reasons unrelated to the database itself'
    )
  ) {
    db.pending.clear()
  }
}

const ErrorComponent = () => {
  return (
    <>
      <Head>
        <title>Unexpected Error - ArtBot for Stable Diffusion</title>
      </Head>
      <PageTitle>An unexpected error has occurred.</PageTitle>
      <div className="mb-[8px]">
        ArtBot encountered an error while attempting to process this request.
        You can attempt to{' '}
        <a className={styles['StyledLink']} href={window.location.href}>
          reload this page
        </a>{' '}
        and see if the problem resolves itself.
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
    </>
  )
}

export default ErrorComponent
