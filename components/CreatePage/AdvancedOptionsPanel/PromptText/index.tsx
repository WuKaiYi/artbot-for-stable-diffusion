import { IconBook, IconPlaylistAdd } from '@tabler/icons-react'
import Tooltip from 'components/Tooltip'
import { Button } from 'components/UI/Button'
import isMobile from 'is-mobile'
import PromptTextArea from 'modules/PromptTextArea'
import { useState } from 'react'

const PromptText = ({ handleChangeValue, input, setInput }: any) => {
  // const [showPromptHistory, setShowPromptHistory] = useState(false)

  return (
    <PromptTextArea
      handleChangeValue={(e) => {
        setInput({ prompt: e.target.value })
      }}
      handleClear={() => {
        // PromptInputSettings.set('prompt', '')
        setInput({
          prompt: ''
        })
      }}
      label={
        <>
          <IconPlaylistAdd />
          Prompt
        </>
      }
      placeholder="Describe your image"
      optionalButton={
        <>
          <Tooltip disabled={isMobile()} targetId="view-prompt-library-tooltip">
            View prompt history.
          </Tooltip>
          <Button
            id="view-prompt-library-tooltip"
            title="Show prompt history"
            onClick={() => {
              // setShowPromptHistory(true)
            }}
            size="small"
          >
            <IconBook stroke={1.5} />
          </Button>
        </>
      }
      value={input.prompt}
    />
  )
}

export default PromptText
