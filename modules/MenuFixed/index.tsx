import Menu from 'components/Menu'
import styles from './menuFixed.module.css'
import { useWindowSize } from 'hooks/useWindowSize'
import AdContainer from 'components/AdContainer'

const MenuFixed = () => {
  const size = useWindowSize()

  if (size?.width && size.width < 1440) {
    return null
  }

  return (
    <div className={styles['fixed-menu-wrapper']}>
      <Menu />
      <AdContainer code="CWYD62QI" placement="tinybotsnet" minSize={1440} />
    </div>
  )
}

export default MenuFixed
