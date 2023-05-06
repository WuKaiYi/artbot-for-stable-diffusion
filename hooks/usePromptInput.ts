import { Dispatch, Reducer, useReducer } from 'react'
import { PromptInput } from '../types'
import DefaultPromptInput from 'models/DefaultPromptInput'

const reducer: Reducer<PromptInput, Partial<PromptInput>> = (
  state: PromptInput,
  newState: Partial<PromptInput>
) => {
  const updatedInputState: PromptInput = { ...state, ...newState }

  //     // if (pageLoaded) {
  //     //   // Only look for new changes to update and write to localStorage via PromptInputSettings
  //     //   // otherwise, cloning the entire input object causes a bunch of CPU thrashing as we iterate
  //     //   // through individual keys. If balues haven't changed, there's no need to update them.
  //     //   PromptInputSettings.saveAllInput(newState, {
  //     //     forceSavePrompt: true
  //     //   })

  //     //   logToConsole({
  //     //     data: updatedInputState,
  //     //     name: 'setInput_state',
  //     //     debugKey: 'DEBUG_LOAD_INPUT'
  //     //   })
  //     // }

  return updatedInputState
}

export const usePromptInput = (): [
  PromptInput,
  Dispatch<Partial<PromptInput>>
] => {
  const [input, setInput] = useReducer(reducer, new DefaultPromptInput())

  return [input, setInput]
}
