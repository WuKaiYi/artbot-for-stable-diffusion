import { useCallback } from 'react'
import Checkbox from '../../components/Checkbox'
import TooltipComponent from '../../components/Tooltip'
import TooltipIcon from '../../components/TooltipIcon'
import { GetSetPromptInput } from 'types'
import Section from 'components/UI/Section'
import SubSectionTitle from 'components/UI/SubSectionTitle'

export const UPSCALERS = [
  'RealESRGAN_x4plus',
  'RealESRGAN_x4plus_anime_6B',
  'NMKD_Siax',
  '4x_AnimeSharp'
]

const UpscalerOptions = ({ input, setInput }: GetSetPromptInput) => {
  const getPostProcessing = useCallback(
    (value: string) => {
      return input.post_processing.indexOf(value) >= 0
    },
    [input.post_processing]
  )

  const handlePostProcessing = useCallback(
    (value: string) => {
      let newPost: string[] = []
      const index = input.post_processing.indexOf(value)

      if (index > -1) {
        newPost = [...input.post_processing]
        newPost.splice(index, 1)
      } else {
        newPost = input.post_processing.filter((postprocName: string) => {
          return UPSCALERS.indexOf(postprocName) === -1
        })

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
        Upscalers
        <TooltipComponent targetId={`upscaler_tooltip`}>
          Upscales your image up to 4x. Some upscalers are tuned to specific
          styles. Only 1 can be selected at a time.
        </TooltipComponent>
        <TooltipIcon id={`upscaler_tooltip`} />
      </SubSectionTitle>
      <div className="flex flex-col items-start gap-2">
        {UPSCALERS.map((upscalerName: string) => {
          return (
            <Checkbox
              key={upscalerName}
              label={upscalerName}
              checked={getPostProcessing(upscalerName)}
              onChange={() => handlePostProcessing(upscalerName)}
            />
          )
        })}
      </div>
    </Section>
  )
}

export default UpscalerOptions
