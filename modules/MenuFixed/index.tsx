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
    <div className={styles['fixed-menu-panel']}>
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
