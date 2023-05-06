import { useState } from 'react'
// import ModalComponent from '../../components/Modal'

// import PendingImagesPanel from '../../modules/PendingImagesPanel'
import { usePromptInput } from 'hooks/usePromptInput'
import CreateImagePanel from 'modules/CreateImagePanel'
import PageTitle from 'components/UI/PageTitle'
import PendingImagesPanel from 'modules/PendingImagesPanel'

const HomePage = () => {
  const [input, setInput] = usePromptInput()

  // Modal test
  const [showModal, setShowModal] = useState(true)

  return (
    <div className="flex flex-col w-full gap-0">
      <PageTitle>Create new image</PageTitle>
      <div className="flex flex-row w-full gap-2">
        <CreateImagePanel input={input} setInput={setInput} />
        <PendingImagesPanel />
      </div>
      {/* <ModalComponent isOpen={showModal} closeModal={() => setShowModal(false)}>
        <p>Modal #2 text!</p>
        <button onClick={() => setShowModal(false)}>Close Modal</button>
      </ModalComponent> */}
      {/* <PendingImagesPanel /> */}
    </div>
  )
}

export default HomePage
