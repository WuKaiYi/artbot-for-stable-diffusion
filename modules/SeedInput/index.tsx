import { IconArrowBarLeft, IconDice2 } from '@tabler/icons-react'
import isMobile from 'is-mobile'
import TooltipComponent from '../../components/Tooltip'
import TooltipIcon from '../../components/TooltipIcon'
import Section from 'components/UI/Section'
import SubSectionTitle from 'components/UI/SubSectionTitle'
import Tooltip from '../../components/Tooltip'
import MaxWidth from 'components/UI/MaxWidth'
import Input from 'components/UI/Input'
import { Button } from 'components/UI/Button'
import AppSettings from 'models/AppSettings'
import PromptInputSettings from 'models/PromptInputSettings'
import { GetSetPromptInput } from 'types'

const SeedInput = ({ input, setInput }: GetSetPromptInput) => {
  return (
    <Section>
      <SubSectionTitle>
        Seed <span className="font-[400] text-xs">(optional)</span>
        <Tooltip targetId={`seed-tooltip`}>
          If seed is left blank, a random seed will be automatically generated
          by the Stable Horde backend.
        </Tooltip>
        <TooltipIcon id={`seed-tooltip`} />
      </SubSectionTitle>
      <MaxWidth width="320px">
        <div className="flex flex-row gap-2">
          <Input
            className="mb-2"
            type="text"
            name="seed"
            onChange={(e: any) => setInput({ seed: e.target.value })}
            value={input.seed}
            width="100%"
          />
          <TooltipComponent
            disabled={isMobile()}
            targetId="generate-seed-tooltip"
          >
            Generate a new random seed.
          </TooltipComponent>
          <TooltipComponent disabled={isMobile()} targetId="clear-seed-tooltip">
            Clear random seed.
          </TooltipComponent>
          <Button
            id="generate-seed-tooltip"
            title="Insert random seed"
            onClick={() => {
              const value = String(Math.abs((Math.random() * 2 ** 32) | 0))
              if (AppSettings.get('saveSeedOnCreate')) {
                PromptInputSettings.set('seed', value)
              }
              setInput({ seed: value })
            }}
          >
            <IconDice2 />
          </Button>
          <Button
            id="clear-seed-tooltip"
            theme="secondary"
            title="Clear"
            onClick={() => {
              // PromptInputSettings.set('seed', '')
              setInput({ seed: '' })
            }}
          >
            <IconArrowBarLeft />
          </Button>
        </div>
      </MaxWidth>
    </Section>
  )
}

export default SeedInput
