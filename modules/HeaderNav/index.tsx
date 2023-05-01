import clsx from 'clsx'
import styles from './headerNav.module.css'
import HeaderNavLogo from './HeaderNavLogo'
import HeaderNavMenu from './HeaderNavMenu'
import { zIndex } from '_constants'
import HeaderNavLinks from './HeaderNavLinks'

const HeaderNav = () => {
  return (
    <header
      className={clsx([
        styles['header-safe-padding'],
        styles['header-container'],
        'flex',
        'flex-row',
        'w-full',
        'items-center',
        'fixed',
        'top-[0]',
        'left-[0]',
        'right-[0]',
        'px-[8px]',
        '2xl:px-[16px]'
      ])}
      style={{ zIndex: zIndex.NAV_BAR }}
    >
      <div
        className={clsx([
          styles['header-content'],
          'flex',
          'flex-row',
          'justify-start',
          'items-center'
        ])}
      >
        <HeaderNavMenu />
        <HeaderNavLogo />
        <HeaderNavLinks />
      </div>
    </header>
  )
}

export default HeaderNav
