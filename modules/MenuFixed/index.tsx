import Menu from 'components/Menu'
import { useWindowSize } from 'hooks/useWindowSize'
import AdContainer from 'components/AdContainer'
import styles from './menuFixed.module.css'
import clsx from 'clsx'

const MenuFixed = () => {
  const size = useWindowSize()

  if (size?.width && size.width < 1440) {
    return null
  }

  return (
    <div
      className="hidden 2xl:block"
      style={{
        backgroundColor: 'var(--dark-shade)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)'
      }}
    >
      <div
        className={clsx(
          styles['fixed-menu-wrapper'],
          styles['hide-scrollbars']
        )}
      >
        <div className={clsx(styles['fixed-menu-height'])}>
          <Menu />
        </div>
        <div className={styles['fixed-menu-ad-block']}>
          <div className={styles['fixed-menu-ad-width']}>
            <AdContainer
              code="CWYD62QI"
              placement="tinybotsnet"
              minSize={1440}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuFixed
