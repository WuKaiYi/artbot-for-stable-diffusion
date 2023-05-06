import { GetSetPromptInput } from 'types'
import styles from './component.module.css'
import PromptTextArea from 'modules/PromptTextArea'
import NegativePromptArea from 'modules/NegativePromptArea'
import { IconSettings } from '@tabler/icons-react'
import Section from 'components/UI/Section'
import SelectModel from 'modules/SelectModel'
import SelectModelDetails from 'modules/SelectModelDetails'
import ImageOrientationOptions from 'modules/ImageOrientationOptions'
import SamplersDropdown from 'modules/SamplersDropdown'
import NumericInputSlider from 'components/CreatePage/AdvancedOptionsPanel/NumericInputSlider'
import SeedInput from 'modules/SeedInput'

const CreateImagePanel = ({ input, setInput }: GetSetPromptInput) => {
  const handleChangeValue = (event: InputEvent) => {
    const inputName = event.target.name
    const inputValue = event.target.value

    setInput({ [inputName]: inputValue })
  }

  return (
    <div className={styles['CreateImagePanel']}>
      <Section style={{ paddingBottom: '16px' }}>
        <div
          className="flex flex-col w-full gap-2 rounded"
          style={{
            color: '#ffffff',
            backgroundColor: 'var(--accent-color)',
            padding: '8px 12px'
          }}
        >
          <PromptTextArea input={input} setInput={setInput} />
          <NegativePromptArea input={input} setInput={setInput} />
        </div>
      </Section>
      <div className="flex flex-col">
        <Section>
          <h2 className="flex flex-row gap-1 items-center mb-2 font-[700] text-[20px]">
            <IconSettings stroke={1.5} />
            Advanced options
          </h2>
        </Section>
        <Section>
          <SelectModel input={input} setInput={setInput} />
          <SelectModelDetails models={input.models} />
        </Section>
        <Section>
          <ImageOrientationOptions input={input} setInput={setInput} />
        </Section>
        <Section>
          <SamplersDropdown input={input} setInput={setInput} />
        </Section>
        <Section>
          <NumericInputSlider
            label="Steps"
            tooltip="Fewer steps generally result in quicker image generations.
              Many models achieve full coherence after a certain number
              of finite steps (60 - 90). Keep your initial queries in
              the 30 - 50 range for best results."
            from={1}
            to={20}
            step={1}
            input={input}
            setInput={setInput}
            fieldName="steps"
            fullWidth
            enforceStepValue
          />
        </Section>
        <Section>
          <NumericInputSlider
            label="Guidance"
            tooltip="Higher numbers follow the prompt more closely. Lower
                numbers give more creativity."
            from={1}
            to={30}
            step={0.5}
            input={input}
            setInput={setInput}
            fieldName="cfg_scale"
            fullWidth
          />
        </Section>
        <Section>
          <SeedInput input={input} setInput={setInput} />
        </Section>
      </div>
    </div>
  )
}

export default CreateImagePanel
