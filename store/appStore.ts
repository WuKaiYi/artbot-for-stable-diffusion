import { makeStore } from 'statery'

interface AppStore {
  adHidden: boolean
  buildId: string
  clusterSettings: {
    forceReloadOnServerUpdate: boolean
  }
  hordePerformance: object
  indexDbSupport: boolean
  imageDetailsModalOpen: boolean
  newImageReady: string
  serverMessage: {
    content: string
    title: string
    type: string
  }
  showAppMenu: boolean
  showBetaOption: boolean
  showImageReadyToast: boolean
  stableHordeApiOnline: boolean
  storageQuotaLimit: boolean
  unsupportedBrowser: boolean
  lockedToWorker: boolean
  pauseJobQueue: boolean
}

export const appInfoStore = makeStore<AppStore>({
  adHidden: false,
  buildId: '',
  clusterSettings: {
    forceReloadOnServerUpdate: true
  },
  hordePerformance: {},
  indexDbSupport: true,
  imageDetailsModalOpen: false,
  newImageReady: '',
  serverMessage: {
    content: '',
    title: '',
    type: ''
  },
  showAppMenu: false,
  showBetaOption: false,
  showImageReadyToast: false,
  stableHordeApiOnline: true,
  storageQuotaLimit: false,
  unsupportedBrowser: false,
  pauseJobQueue: false,
  lockedToWorker: false
})

export const setPauseJobQueue = (val: boolean) => {
  appInfoStore.set(() => ({
    pauseJobQueue: val
  }))
}

export const setLockedToWorker = (val: boolean) => {
  appInfoStore.set(() => ({
    lockedToWorker: val
  }))
}

export const setAdHidden = (val: boolean) => {
  appInfoStore.set(() => ({
    adHidden: val
  }))
}

export const setStorageQuotaLimit = (val: boolean = false) => {
  appInfoStore.set(() => ({
    storageQuotaLimit: val
  }))
}

export const setImageDetailsModalOpen = (val: boolean = false) => {
  appInfoStore.set(() => ({
    imageDetailsModalOpen: val
  }))
}

export const setClusterSettings = (obj: any) => {
  appInfoStore.set(() => ({
    clusterSettings: obj
  }))
}

export const setServerMessage = (obj: any) => {
  appInfoStore.set(() => ({
    serverMessage: { ...obj }
  }))
}

export const setHordePerformance = (obj: object) => {
  appInfoStore.set(() => ({
    hordePerformance: obj
  }))
}

export const setUnsupportedBrowser = (val: boolean = false) => {
  appInfoStore.set(() => ({
    unsupportedBrowser: val
  }))
}

export const setShowAppMenu = (val: boolean = false) => {
  appInfoStore.set(() => ({
    showAppMenu: val
  }))
}

export const setShowBetaOption = (val: boolean) => {
  appInfoStore.set(() => ({
    showBetaOption: val
  }))
}

export const setBuildId = (id: string) => {
  appInfoStore.set(() => ({
    buildId: id
  }))
}

export const setHordeStatus = (val: boolean) => {
  appInfoStore.set(() => ({
    stableHordeApiOnline: val
  }))
}

export const setIndexDbSupport = (bool: boolean) => {
  appInfoStore.set(() => ({
    indexDbSupport: bool
  }))
}

export const setShowImageReadyToast = (bool: boolean) => {
  if (appInfoStore.state.showImageReadyToast === bool) {
    return
  }

  appInfoStore.set(() => ({
    showImageReadyToast: bool
  }))
}

export const setNewImageReady = (jobId: string) => {
  // Attempt to prevent race condition when PendingItems component
  // tries to update the toast. For some reason, it's not
  // getting the correct state.

  if (jobId && appInfoStore.state.showImageReadyToast) {
    return
  }

  appInfoStore.set(() => ({
    newImageReady: jobId,
    showImageReadyToast: jobId ? true : false
  }))
}
