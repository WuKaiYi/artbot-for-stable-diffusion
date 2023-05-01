import { IconMenu2 } from '@tabler/icons-react'
import { setShowAppMenu } from 'store/appStore'
import styles from './headerNavMenu.module.css'

const HeaderNavMenu = () => {
  return (
    <div
      className={styles['header-nav-menu-wrapper']}
      onClick={() => setShowAppMenu(true)}
    >
      <IconMenu2 className={styles['header-nav-menu-img']} />
    </div>
  )
}

export default HeaderNavMenu
