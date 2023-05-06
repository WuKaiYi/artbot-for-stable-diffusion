import * as React from 'react'
import styles from './pageTitle.module.css'

const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className={styles['PageTitle']}>{children}</h1>
}

export default PageTitle
