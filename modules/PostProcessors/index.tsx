import { useCallback } from 'react'
import Checkbox from '../../components/Checkbox'
import TooltipComponent from '../../components/Tooltip'
import TooltipIcon from '../../components/TooltipIcon'
import { GetSetPromptInput } from 'types'
import Section from 'components/UI/Section'
import SubSectionTitle from 'components/UI/SubSectionTitle'
import NumericInputSlider from 'components/CreatePage/AdvancedOptionsPanel/NumericInputSlider'

const PostProcessors = ({ input, setInput }: GetSetPromptInput) => {
  const getPostProcessing = useCallback(
    (value: string) => {
      return input.post_processing.includes(value)
    },
    [input.post_processing]
  )

  const handlePostProcessing = useCallback(
    (value: string) => {
      let newPost = [...input.post_processing]
      const index = newPost.indexOf(value)

      if (index > -1) {
        newPost.splice(index, 1)
      } else {
        newPost.push(value)
      }

      // PromptInputSettings.set('post_processing', newPost)
      setInput({ post_processing: newPost })
    },
    [input.post_processing, setInput]
  )

  return (
    <Section>
      <SubSectionTitle>
        Post-processing
        <TooltipComponent targetId={'post-processing-tooltip'}>
          Post-processing options such as face improvement and image upscaling.
        </TooltipComponent>
        <TooltipIcon id={`post-processing-tooltip`} />
      </SubSectionTitle>
      <div className="flex flex-col items-start gap-2">
        <Checkbox
          label={`GFPGAN (improves faces)`}
          checked={getPostProcessing('GFPGAN')}
          onChange={() => handlePostProcessing('GFPGAN')}
        />
        <Checkbox
          label={`CodeFormers (improves faces)`}
          checked={getPostProcessing('CodeFormers')}
          onChange={() => handlePostProcessing('CodeFormers')}
        />
        {(getPostProcessing('GFPGAN') || getPostProcessing('CodeFormers')) && (
          <NumericInputSlider
            label="Face-fix strength"
            tooltip="0.05 is the weakest effect (barely noticeable improvements), while 1.0 is the strongest effect."
            from={0.05}
            to={1.0}
            step={0.05}
            input={input}
            setInput={setInput}
            fieldName="facefixer_strength"
          />
        )}
        <Checkbox
          label={`Strip background`}
          checked={getPostProcessing(`strip_background`)}
          onChange={() => handlePostProcessing(`strip_background`)}
        />
      </div>
    </Section>
  )
}

export default PostProcessors
