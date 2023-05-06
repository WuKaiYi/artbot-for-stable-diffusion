import { GetSetPromptInput } from 'types'
import styles from './component.module.css'
import PromptTextArea from 'modules/PromptTextArea'
import NegativePromptArea from 'modules/NegativePromptArea'
import { IconSettings } from '@tabler/icons-react'
import Section from 'components/UI/Section'

const CreateImagePanel = ({ input, setInput }: GetSetPromptInput) => {
  const handleChangeValue = (event: InputEvent) => {
    const inputName = event.target.name
    const inputValue = event.target.value

    setInput({ [inputName]: inputValue })
  }

  return (
    <div className={styles['CreateImagePanel']}>
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
      <div>
        <Section>
          <h2 className="flex flex-row gap-1 items-center mb-2 font-[700] text-[18px]">
            <IconSettings stroke={1.5} />
            Advanced options
          </h2>
        </Section>
      </div>
    </div>
  )
}

export default CreateImagePanel
