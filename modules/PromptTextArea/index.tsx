import { IconBook, IconPlaylistAdd, IconTags } from '@tabler/icons-react'
import PromptHistory from 'components/PromptHistory'
import Tooltip from 'components/Tooltip'
import { Button } from 'components/UI/Button'
import InteractiveModal from 'components/UI/InteractiveModal/interactiveModal'
import isMobile from 'is-mobile'
import PromptInputSettings from 'models/PromptInputSettings'
import BasePromptTextArea from 'modules/BasePromptTextArea'
import { useState } from 'react'
import { GetSetPromptInput } from 'types'

const PromptTextArea = ({ input, setInput }: GetSetPromptInput) => {
  const [showPromptHistory, setShowPromptHistory] = useState(false)

  return (
    <div className="mb-1">
      {showPromptHistory && (
        <InteractiveModal handleClose={() => setShowPromptHistory(false)}>
          <PromptHistory
            copyPrompt={setInput}
            handleClose={() => setShowPromptHistory(false)}
          />
        </InteractiveModal>
      )}
      <BasePromptTextArea
        handleChangeValue={(e) => {
          setInput({ prompt: e.target.value })
        }}
        handleClear={() => {
          PromptInputSettings.set('prompt', '')
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
            <Tooltip
              disabled={isMobile()}
              targetId="view-prompt-library-tooltip"
            >
              View prompt history.
            </Tooltip>
            <Button
              id="view-prompt-library-tooltip"
              title="Show prompt history"
              onClick={() => {
                setShowPromptHistory(true)
              }}
              size="small"
            >
              <IconBook stroke={1.5} />
            </Button>
          </>
        }
        value={input.prompt}
      />
      <div className="flex flex-row gap-2">
        <Button
          id="negative-save-tooltip"
          size="small"
          onClick={() => {}}
          width="120px"
        >
          <IconTags stroke={1.5} />
          Style tags
        </Button>
      </div>
    </div>
  )
}

export default PromptTextArea
