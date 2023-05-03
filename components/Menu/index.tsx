import { useStore } from 'statery'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import IconCreate from '../icons/CreateIcon'
import HelpIcon from '../icons/HelpIcon'
import HourglassIcon from '../icons/HourglassIcon'
import InfoIcon from '../icons/InfoIcon'
import NotesIcon from '../icons/NotesIcon'
import PhotoIcon from '../icons/PhotoIcon'
import ZoomQuestionIcon from '../icons/ZoomQuestionIcon'
import QuestionMarkIcon from '../icons/QuestionMarkIcon'
import LineDashedIcon from '../icons/LineDashedIcon'
import StarsIcon from '../icons/StarsIcon'
import SettingsIcon from '../icons/SettingsIcon'
import { appInfoStore, setShowAppMenu } from '../../store/appStore'
import { lockScroll, unlockScroll } from '../../utils/appUtils'
import PencilIcon from '../icons/PencilIcon'
import RobotIcon from '../icons/RobotIcon'

import styles from './menu.module.css'

const Menu = () => {
  const router = useRouter()
  const appState = useStore(appInfoStore)
  const { showAppMenu } = appState

  const handleClose = () => {
    setShowAppMenu(false)
  }

  const navigateToLink = (path: string) => {
    handleClose()
    router.push(path)
  }

  useEffect(() => {
    if (showAppMenu) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }, [showAppMenu])

  return (
    <ul>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/')
        }}
      >
        <IconCreate />
        Create
      </li>
      <div className={styles['menu-sub-options']}>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/controlnet')
          }}
        >
          <LineDashedIcon />
          ControlNet
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/?panel=img2img')
          }}
        >
          <LineDashedIcon />
          img2img
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/?panel=inpainting')
          }}
        >
          <LineDashedIcon />
          Inpainting
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/live-paint')
          }}
        >
          <LineDashedIcon />
          Live Paint
        </div>
      </div>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/draw')
        }}
      >
        <PencilIcon />
        Draw
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/interrogate')
        }}
      >
        <ZoomQuestionIcon />
        Interrogate
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/rate')
        }}
      >
        <StarsIcon />
        Rate Images
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/pending')
        }}
      >
        <HourglassIcon />
        Pending
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/images')
        }}
      >
        <PhotoIcon />
        Images
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/info')
        }}
      >
        <InfoIcon />
        Info
      </li>
      <div className={styles['menu-sub-options']}>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/info/models')
          }}
        >
          <LineDashedIcon />
          Model Details
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/info/models/updates')
          }}
        >
          <LineDashedIcon />
          Model Updates
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/info/models?show=favorite-models')
          }}
        >
          <LineDashedIcon />
          Favorite Models
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/info/workers')
          }}
        >
          <LineDashedIcon />
          Worker details
        </div>
      </div>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/faq')
        }}
      >
        <QuestionMarkIcon />
        FAQ
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/changelog')
        }}
      >
        <NotesIcon />
        Changelog
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/settings')
        }}
      >
        <SettingsIcon />
        Settings
      </li>
      <div className={styles['menu-sub-options']}>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/settings')
          }}
        >
          <LineDashedIcon />
          Stable Horde Settings
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/settings?panel=workers')
          }}
        >
          <LineDashedIcon />
          Manage Workers
        </div>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/settings?panel=prefs')
          }}
        >
          <LineDashedIcon />
          ArtBot Prefs
        </div>
      </div>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/profile')
        }}
      >
        <RobotIcon />
        User Profile
      </li>
      <li
        className={styles['menu-option']}
        onClick={() => {
          navigateToLink('/about')
        }}
      >
        <HelpIcon />
        About
      </li>
      <div className={styles['menu-sub-options']}>
        <div
          className={styles['menu-sub-option']}
          onClick={() => {
            navigateToLink('/contact')
          }}
        >
          <LineDashedIcon />
          Contact
        </div>
      </div>
    </ul>
  )
}

export default Menu
