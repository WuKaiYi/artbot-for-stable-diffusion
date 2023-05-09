import { useEffect } from 'react'

import useComponentState from '../../hooks/useComponentState'
import { PromptTypes } from '../../types'
import { db, getPrompts } from '../../utils/db'
import CopyIcon from '../icons/CopyIcon'
import HeartIcon from '../icons/HeartIcon'
import TrashIcon from '../icons/TrashIcon'
import { Button } from '../UI/Button'
import Input from '../UI/Input'
import PageTitle from '../UI/PageTitle'
import TextButton from '../UI/TextButton'

import styles from './promptHistory.module.css'
import Row from 'components/Row'

const PromptHistory = (props: any) => {
  const [componentState, setComponentState] = useComponentState({
    filter: '',
    prompts: [],
    view: 'all'
  })

  const fetchPrompts = async (value?: string) => {
    let prompts = []
    if (value === 'favorites') {
      prompts = await getPrompts(PromptTypes.PromptFavorite)
    } else {
      prompts = await getPrompts(
        PromptTypes.PromptHistory,
        PromptTypes.PromptFavorite
      )
    }

    setComponentState({ prompts })
  }

  const handleFavoriteClick = async (p: any) => {
    const { id, promptType } = p
    const newPromptType =
      promptType === PromptTypes.PromptFavorite
        ? PromptTypes.PromptHistory
        : PromptTypes.PromptFavorite

    await db.prompts.update(id, {
      promptType: newPromptType
    })
  }

  useEffect(() => {
    fetchPrompts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredPrompts = componentState.prompts.filter((p: any) => {
    const format = p.prompt.toLowerCase()
    if (format.indexOf(componentState.filter.toLowerCase()) >= 0) {
      return true
    }
  })

  return (
    <div className="text-black dark:text-white">
      <PageTitle>
        {componentState.view === 'all' && `Prompt history`}
        {componentState.view === 'favorites' && `Favorite prompts`}
      </PageTitle>
      <div>
        <Input
          // @ts-ignore
          className="mb-2"
          type="text"
          name="filterPrompt"
          placeholder="Filter prompts"
          onChange={(e: any) => {
            setComponentState({ filter: e.target.value })
          }}
          // @ts-ignore
          value={componentState.filter}
          width="100%"
        />
      </div>
      <div className="flex flex-row justify-between mb-2">
        <TextButton
          onClick={() => {
            if (componentState.view === 'all') {
              setComponentState({ view: 'favorites' })
              fetchPrompts('favorites')
            } else {
              setComponentState({ view: 'all' })
              fetchPrompts()
            }
          }}
        >
          {componentState.view === 'all' ? `show favorites` : `show all`}
        </TextButton>
        <TextButton
          onClick={() => {
            setComponentState({ filter: '' })
          }}
        >
          clear filter
        </TextButton>
      </div>
      {!componentState.filter && filteredPrompts.length === 0 && (
        <div>Nothing to see here. Create an image, first!</div>
      )}
      {componentState.filter && filteredPrompts.length === 0 && (
        <div>No prompts found.</div>
      )}
      {filteredPrompts.length > 0 && (
        <div className={styles['PromptLists']}>
          {filteredPrompts.map((p: any) => {
            return (
              <div className={styles['PromptWrapper']} key={`prompt_${p.id}`}>
                {/* <MenuButtonWrapper>
                <MenuButton
                  // active={optimisticFavorite}
                  title="Save as favorite"
                  // onClick={handleFavoriteClick}
                >
                  <HeartIcon />
                </MenuButton>
              </MenuButtonWrapper> */}
                <div className={styles['PromptText']}>{p.prompt}</div>
                <Row className="justify-between">
                  <div>
                    <div className={styles['Timestamp']}>
                      {new Date(p.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button
                      onClick={() => {
                        handleFavoriteClick(p)
                        fetchPrompts(componentState.view)
                      }}
                    >
                      <HeartIcon
                        size={24}
                        fill={
                          p.promptType === PromptTypes.PromptFavorite
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    </Button>
                    <Button
                      onClick={() => {
                        props.copyPrompt({ prompt: p.prompt })
                        props.handleClose()
                      }}
                    >
                      <CopyIcon size={24} />
                    </Button>
                    <Button
                      title="Delete prompt"
                      theme="secondary"
                      onClick={async () => {
                        await db.prompts.bulkDelete([p.id])
                        fetchPrompts(componentState.view)
                      }}
                    >
                      <TrashIcon size={24} />
                    </Button>
                  </div>
                </Row>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PromptHistory
