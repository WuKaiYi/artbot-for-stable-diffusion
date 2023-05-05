import { GetSetPromptInput } from 'types'
import TooltipComponent from '../../components/Tooltip'
import TooltipIcon from '../../components/TooltipIcon'
import Section from 'components/UI/Section'
import SubSectionTitle from 'components/UI/SubSectionTitle'
import MaxWidth from 'components/UI/MaxWidth'
import Select from 'components/UI/Select'
import ImageModels from 'controllers/ImageModels'
import { useAvailableModels } from 'hooks/useAvailableModels'

const SelectModel = ({ input, setInput }: GetSetPromptInput) => {
  const [modelsOptions] = useAvailableModels({ input })
  return (
    <Section>
      <SubSectionTitle>
        Model
        <TooltipComponent targetId={`select-models-tooltip`}>
          Models currently available within the horde. Numbers in parentheses
          indicate number of works. Generally, these models will generate images
          quicker.
        </TooltipComponent>
        <TooltipIcon id={`select-models-tooltip`} />
      </SubSectionTitle>
      <MaxWidth width="320px">
        <Select
          options={modelsOptions}
          onChange={(obj: any) => setInput({ models: [obj.value] })}
          value={ImageModels.dropdownValue(input)}
        />
      </MaxWidth>
    </Section>
  )
}

export default SelectModel
