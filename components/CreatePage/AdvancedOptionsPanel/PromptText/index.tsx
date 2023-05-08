import { IconBook, IconPlaylistAdd } from '@tabler/icons-react'
import PromptHistory from 'components/PromptHistory'
import Tooltip from 'components/Tooltip'
import { Button } from 'components/UI/Button'
import InteractiveModal from 'components/UI/InteractiveModal/interactiveModal'
import isMobile from 'is-mobile'
import PromptInputSettings from 'models/PromptInputSettings'
import BasePromptTextArea from 'modules/BasePromptTextArea'
import { useState } from 'react'

const PromptText = ({ input, setInput }: any) => {
  const [showPromptHistory, setShowPromptHistory] = useState(false)

  return (
    <>
      {showPromptHistory && (
        <InteractiveModal handleClose={() => setShowPromptHistory(false)}>
          <PromptHistory
            copyPrompt={setInput}
            handleClose={() => setShowPromptHistory(false)}
          />
        </InteractiveModal>
      )}
      <div className="flex flex-row items-center gap-2 mt-0 mb-1 text-sm font-bold">
        <PlaylistXIcon hideCross />
        Prompt
      </div>
      <FlexRow>
        <TextArea
          name="prompt"
          placeholder="Describe your image..."
          onChange={handleChangeValue}
          value={input.prompt}
        />
        <div className="flex flex-col gap-2">
          <Button
            title="Clear current input"
            theme="secondary"
            onClick={() => {
              PromptInputSettings.set('prompt', '')
              setInput({
                prompt: ''
              })
            }}
          >
            <ArrowBarLeftIcon />
          </Button>
          <Button
            title="Show prompt history"
            onClick={() => {
              setShowPromptHistory(true)
            }}
          >
            <BookIcon />
          </Button>
        </div>
      </FlexRow>
    </>
  )
}

export default PromptText
