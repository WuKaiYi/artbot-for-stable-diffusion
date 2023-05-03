import { trackEvent } from 'api/telemetry'
import Tooltip from 'components/Tooltip'
import TooltipIcon from 'components/TooltipIcon'
import MaxWidth from 'components/UI/MaxWidth'
import Section from 'components/UI/Section'
import Select from 'components/UI/Select'
import SubSectionTitle from 'components/UI/SubSectionTitle'
import Samplers from 'controllers/Samplers'
import ReactSwitch from 'react-switch'
import { GetSetPromptInput } from 'types'
import { SourceProcessing } from 'utils/promptUtils'

interface SamplersProps extends GetSetPromptInput {
  showMultiModel?: boolean
  hideShowAllSamplers?: boolean
}

const SamplersDropdown = ({
  input,
  setInput,
  showMultiModel,
  hideShowAllSamplers
}: SamplersProps) => {
  const showAllSamplersInput =
    input.source_processing !== SourceProcessing.Img2Img &&
    input.source_processing !== SourceProcessing.InPainting &&
    !input.useAllModels &&
    !input.useFavoriteModels &&
    !showMultiModel &&
    !hideShowAllSamplers

  if (!showAllSamplersInput) {
    return (
      <Section>
        <SubSectionTitle>Sampler</SubSectionTitle>
        {(input.source_processing === SourceProcessing.InPainting &&
          input.models[0] === 'stable_diffusion_inpainting') ||
        (input.source_image && input.control_type !== '') ? (
          <div className="mt-[-6px] text-sm text-slate-500 dark:text-slate-400 font-[600]">
            Note: Sampler disabled when controlnet or inpainting model is used.
          </div>
        ) : (
          <MaxWidth width="240px">
            <Select
              options={Samplers.dropdownOptions({
                model: input.models[0],
                isImg2Img: input.source_image
              })}
              onChange={(obj: { value: string; label: string }) => {
                // PromptInputSettings.set('sampler', obj.value)
                setInput({ sampler: obj.value })
              }}
              value={Samplers.dropdownValue(input.sampler)}
            />
          </MaxWidth>
        )}
      </Section>
    )
  }

  if (showAllSamplersInput) {
    return (
      <Section>
        <SubSectionTitle>
          Use all samplers
          <Tooltip targetId={`use-all-samplers-tooltip`}>
            Automatically generate an image for each sampler available.
          </Tooltip>
          <TooltipIcon id={`use-all-samplers-tooltip`} />
        </SubSectionTitle>
        <ReactSwitch
          disabled={
            input.useMultiGuidance || input.useMultiSteps ? true : false
          }
          onChange={() => {
            if (!input.useAllSamplers) {
              trackEvent({
                event: 'USE_ALL_SAMPLERS_CLICK',
                context: '/pages/index'
              })
              setInput({
                numImages: 1,
                useAllSamplers: true,
                useAllModels: false,
                useFavoriteModels: false,
                useMultiSteps: false
              })

              PromptInputSettings.set('numImages', 1)
              PromptInputSettings.set('useAllSamplers', true)
              PromptInputSettings.set('useAllModels', false)
              PromptInputSettings.set('useFavoriteModels', false)
              PromptInputSettings.set('useMultiSteps', false)
            } else {
              PromptInputSettings.set('useAllSamplers', false)
              setInput({ useAllSamplers: false })
            }
          }}
          checked={input.useAllSamplers}
        />
      </Section>
    )
  }
}

export default SamplersDropdown
