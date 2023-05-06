/* eslint-disable @next/next/no-img-element */
import { useStore } from 'statery'

import Section from 'components/UI/Section'
import MaxWidth from 'components/UI/MaxWidth'
import SubSectionTitle from 'components/UI/SubSectionTitle'
import { modelInfoStore } from 'store/modelStore'

const SelectModelDetails = ({ models }: { models: Array<string> }) => {
  const { modelDetails } = useStore(modelInfoStore)
  const model = modelDetails[models[0]]

  if (models.length > 1 || models.length === 0 || !model) {
    return null
  }

  const hasTrigger = model.trigger && Array.isArray(model.trigger)

  return (
    <Section>
      <MaxWidth width="480px">
        <div
          style={{
            border: '1px solid rgb(126, 90, 108)',
            padding: '8px 16px',
            borderRadius: '4px'
          }}
        >
          <div className="flex flex-col w-full gap-2">
            <SubSectionTitle>Model details</SubSectionTitle>
            <div className="mb-1 text-sm">
              Image showcase for <em>{models[0]}</em>
            </div>
            <img
              src={model.showcases[0]}
              alt={`Example image output for model: ${models[0]}`}
              width="280"
              height="280"
              style={{ borderRadius: '4px' }}
            />
            <div className="mb-2 text-xs">{model.description}</div>
            <div className="mb-2 text-xs">
              <strong>Style:</strong> {model.style} {model.nsfw ? '(nsfw)' : ''}
            </div>
            {hasTrigger && (
              <div className="mb-2 text-xs">
                <strong>Trigger words: </strong>
                {model?.trigger?.map((word: string) => {
                  return <div key={`trigger_${word}`}>&quot;{word}&quot;</div>
                })}
              </div>
            )}
          </div>
        </div>
      </MaxWidth>
    </Section>
  )
}

export default SelectModelDetails
