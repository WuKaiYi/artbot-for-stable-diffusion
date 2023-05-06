import { trackEvent } from 'api/telemetry'
import { Button } from 'components/UI/Button'
import { useCallback, useState } from 'react'
import { db, getDefaultPrompt, setDefaultPrompt } from 'utils/db'
import BasePromptTextArea from 'modules/BasePromptTextArea'
import {
  IconDeviceFloppy,
  IconFolder,
  IconPlaylistX
} from '@tabler/icons-react'
import isMobile from 'is-mobile'
import Tooltip from 'components/Tooltip'
import PromptInputSettings from 'models/PromptInputSettings'
import NegativePrompts from 'components/CreatePage/NegativePrompts'

const NegativePromptArea = ({ input, setInput }: any) => {
  const [negativePromptLibraryPanelOpen, setNegativePromptLibraryPanelOpen] =
    useState(false)

  const handleSaveNeg = useCallback(async () => {
    const trimInput = input.negative.trim()
    if (!trimInput) {
      return
    }

    const defaultPromptResult = (await getDefaultPrompt()) || []
    const [defaultPrompt = {}] = defaultPromptResult

    if (defaultPrompt.prompt === trimInput) {
      return
    }

    trackEvent({
      event: 'SAVE_DEFAULT_NEG_PROMPT',
      context: '/pages/index'
    })

    try {
      await db.prompts.add({
        prompt: trimInput,
        promptType: 'negative'
      })

      await setDefaultPrompt(trimInput)
    } catch (err) {}
  }, [input.negative])
  return (
    <>
      {negativePromptLibraryPanelOpen && (
        <NegativePrompts
          open={negativePromptLibraryPanelOpen}
          handleClosePane={() => setNegativePromptLibraryPanelOpen(false)}
          setInput={setInput}
        />
      )}
      <div className="flex flex-col gap-1">
        <BasePromptTextArea
          handleChangeValue={(e) => {
            setInput({ negative: e.target.value })
          }}
          handleClear={() => {
            PromptInputSettings.set('negative', '')
            setInput({
              negative: ''
            })
          }}
          label={
            <>
              <IconPlaylistX />
              Negative prompt{' '}
              <span className="font-[400] text-xs">(optional)</span>
            </>
          }
          placeholder="Words to de-emphasize from this image"
          value={input.negative}
        />
        <div className="flex flex-row gap-2">
          <Tooltip disabled={isMobile()} targetId="negative-save-tooltip">
            Save negative prompt to your prompt library.
          </Tooltip>
          <Tooltip disabled={isMobile()} targetId="negative-load-tooltip">
            Load a negative prompt from your prompt library.
          </Tooltip>
          <Button
            id="negative-save-tooltip"
            className="w-[120px]"
            size="small"
            onClick={handleSaveNeg}
          >
            <IconDeviceFloppy stroke={1.5} />
            Save
          </Button>
          <Button
            id="negative-load-tooltip"
            className="w-[120px]"
            size="small"
            onClick={() => setNegativePromptLibraryPanelOpen(true)}
          >
            <IconFolder stroke={1.5} />
            Load
          </Button>
        </div>
      </div>
    </>
  )
}

export default NegativePromptArea
