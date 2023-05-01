import { IconMenu2 } from '@tabler/icons-react'
import { setShowAppMenu } from 'store/appStore'
import styles from './headerNavMenu.module.css'

const HeaderNavMenu = () => {
  return (
    <>
      <div className="block 2xl:hidden" onClick={() => setShowAppMenu(true)}>
        <IconMenu2 className={styles['header-nav-logo-img']} />
      </div>
    </>
  )
}

export default HeaderNavMenu
