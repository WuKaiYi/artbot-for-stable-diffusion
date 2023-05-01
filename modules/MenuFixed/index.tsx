import Menu from 'components/Menu'
import styles from './menuFixed.module.css'
import { useWindowSize } from 'hooks/useWindowSize'

const MenuFixed = () => {
  const size = useWindowSize()

  if (size?.width && size.width < 1440) {
    return null
  }

  return (
    <div className={styles['fixed-menu-wrapper']}>
      <Menu />
    </div>
  )
}

export default MenuFixed
