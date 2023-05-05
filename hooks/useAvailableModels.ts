import ImageModels from 'controllers/ImageModels'
import DefaultPromptInput from 'models/DefaultPromptInput'
import { useStore } from 'statery'
import { modelInfoStore } from 'store/modelStore'

export function useAvailableModels({
  input,
  filterNsfw = false,
  sort = 'workers'
}: {
  input: DefaultPromptInput
  filterNsfw?: boolean
  sort?: string
}) {
  const { availableModels, modelDetails } = useStore(modelInfoStore)

  const filteredModels = ImageModels.getValidModels({
    availableModels,
    modelDetails,
    input,
    filterNsfw,
    sort
  })

  const modelsOptions = ImageModels.dropdownOptions({ filteredModels })

  return [modelsOptions]
}
