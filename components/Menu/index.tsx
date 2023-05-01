import { useStore } from 'statery'
import { useEffect } from 'react'
import styled from 'styled-components'
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

const MenuOption = styled.li`
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  margin-bottom: 14px;

  &:hover {
    color: rgb(20, 184, 166);
  }
`

const SubOptions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -8px;
  padding-left: 32px;
  margin-bottom: 12px;
`

const SubOption = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  column-gap: 4px;

  &:hover {
    color: rgb(20, 184, 166);
  }
`

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
      <MenuOption
        onClick={() => {
          navigateToLink('/')
        }}
      >
        <IconCreate />
        Create
      </MenuOption>
      <SubOptions>
        <SubOption
          onClick={() => {
            navigateToLink('/controlnet')
          }}
        >
          <LineDashedIcon />
          ControlNet
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/?panel=img2img')
          }}
        >
          <LineDashedIcon />
          img2img
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/?panel=inpainting')
          }}
        >
          <LineDashedIcon />
          Inpainting
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/live-paint')
          }}
        >
          <LineDashedIcon />
          Live Paint
        </SubOption>
      </SubOptions>
      <MenuOption
        onClick={() => {
          navigateToLink('/draw')
        }}
      >
        <PencilIcon />
        Draw
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/interrogate')
        }}
      >
        <ZoomQuestionIcon />
        Interrogate
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/rate')
        }}
      >
        <StarsIcon />
        Rate Images
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/pending')
        }}
      >
        <HourglassIcon />
        Pending
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/images')
        }}
      >
        <PhotoIcon />
        Images
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/info')
        }}
      >
        <InfoIcon />
        Info
      </MenuOption>
      <SubOptions>
        <SubOption
          onClick={() => {
            navigateToLink('/info/models')
          }}
        >
          <LineDashedIcon />
          Model Details
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/info/models/updates')
          }}
        >
          <LineDashedIcon />
          Model Updates
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/info/models?show=favorite-models')
          }}
        >
          <LineDashedIcon />
          Favorite Models
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/info/workers')
          }}
        >
          <LineDashedIcon />
          Worker details
        </SubOption>
      </SubOptions>
      <MenuOption
        onClick={() => {
          navigateToLink('/faq')
        }}
      >
        <QuestionMarkIcon />
        FAQ
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/changelog')
        }}
      >
        <NotesIcon />
        Changelog
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/settings')
        }}
      >
        <SettingsIcon />
        Settings
      </MenuOption>
      <SubOptions>
        <SubOption
          onClick={() => {
            navigateToLink('/settings')
          }}
        >
          <LineDashedIcon />
          Stable Horde Settings
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/settings?panel=workers')
          }}
        >
          <LineDashedIcon />
          Manage Workers
        </SubOption>
        <SubOption
          onClick={() => {
            navigateToLink('/settings?panel=prefs')
          }}
        >
          <LineDashedIcon />
          ArtBot Prefs
        </SubOption>
      </SubOptions>
      <MenuOption
        onClick={() => {
          navigateToLink('/profile')
        }}
      >
        <RobotIcon />
        User Profile
      </MenuOption>
      <MenuOption
        onClick={() => {
          navigateToLink('/about')
        }}
      >
        <HelpIcon />
        About
      </MenuOption>
      <SubOptions>
        <SubOption
          onClick={() => {
            navigateToLink('/contact')
          }}
        >
          <LineDashedIcon />
          Contact
        </SubOption>
      </SubOptions>
    </ul>
  )
}

export default Menu
