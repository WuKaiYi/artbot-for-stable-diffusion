import { sortedPresets, stylePresets } from '../../../utils/stylePresets'
import { useEffect, useState } from 'react'
import PhotoIcon from '../../icons/PhotoIcon'
import ArrowBarLeftIcon from '../../icons/ArrowBarLeftIcon'
import { Button } from '../../UI/Button'
import 'react-tooltip/dist/react-tooltip.css'

import TextTooltipRow from 'components/UI/TextTooltipRow'
import TooltipComponent from 'components/UI/Tooltip'
import Select from 'components/UI/Select'
interface IProps {
  input: any
  setInput(obj: any): any
}

const presetOptions = () => {
  let options = [{ value: 'none', label: 'None' }]

  sortedPresets().forEach((preset) => {
    options.push({ value: preset, label: preset })
  })

  options.push({ value: 'random', label: 'random' })

  return options
}

const StylesDrodown = ({ input, setInput }: IProps) => {
  const [presetValue, setPresetValue] = useState({
    value: 'none',
    label: 'None'
  })
  presetOptions()

  const handleSelect = (obj: { value: string; label: string }) => {
    let isNotListed = false
    let presetValue = obj.value

    if (presetValue === 'none' || presetValue === 'random') {
      isNotListed = true
    }

    setInput({
      // @ts-ignore
      models: isNotListed ? input.models : [stylePresets[obj.value].model],
      stylePreset: obj.value
    })
  }

  useEffect(() => {
    const updateValue = presetOptions().filter((option) => {
      return input?.stylePreset === option.value
    })[0]

    setPresetValue(updateValue)
  }, [input?.stylePreset])

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center w-full gap-2 mt-2 mb-1 font-bold text-md">
        <TextTooltipRow>
          <PhotoIcon size={32} />
          Style preset
          <TooltipComponent tooltipId="styles-drown-tooltip">
            Predefined community styles that will automatically select a model
            and add relevant prompt and negative prompt parameters when
            submitted to the Stable Horde API.
          </TooltipComponent>
        </TextTooltipRow>
      </div>
      <div className="flex flex-row items-center w-full gap-2">
        <Select
          onChange={handleSelect}
          options={presetOptions()}
          value={presetValue}
        />
        <Button
          theme="secondary"
          onClick={() => {
            setInput({ stylePreset: 'none' })
          }}
        >
          <ArrowBarLeftIcon />
        </Button>
      </div>
    </div>
  )
}

export default StylesDrodown
