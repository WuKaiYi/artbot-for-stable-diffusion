import { useStore } from 'statery'
import clsx from 'clsx'
import { IconX } from '@tabler/icons-react'

import { appInfoStore, setShowAppMenu } from 'store/appStore'
import { useEffect } from 'react'
import Menu from 'components/Menu'
import Overlay from 'components/UI/Overlay'
import styles from './menuSlider.module.css'
import { useWindowSize } from 'hooks/useWindowSize'

const MenuSlider = () => {
  const size = useWindowSize()
  const appState = useStore(appInfoStore)
  const { showAppMenu } = appState

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowAppMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (showAppMenu && size.width && size.width >= 1440) {
      setShowAppMenu(false)
    }
  }, [size, showAppMenu])

  if (size?.width && size.width >= 1440) {
    return null
  }

  return (
    <>
      {showAppMenu && <Overlay handleClose={() => setShowAppMenu(false)} />}
      <div
        className={clsx(
          styles['sliding-menu-wrapper'],
          showAppMenu ? styles['show-sliding-menu'] : ''
        )}
      >
        <div
          className={styles['close-btn-wrapper']}
          onClick={() => setShowAppMenu(false)}
        >
          <IconX size={32} stroke={1} />
        </div>
        <Menu />
      </div>
    </>
  )
}

export default MenuSlider
