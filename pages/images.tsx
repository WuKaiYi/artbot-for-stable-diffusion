/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LazyLoad from 'react-lazyload'

import PageTitle from '../components/UI/PageTitle'
import Spinner from '../components/Spinner'
import {
  bulkDeleteImages,
  countCompletedJobs,
  countFilterCompleted,
  fetchCompletedJobs,
  filterCompletedJobs,
  imageCount
} from '../utils/db'
import ImageSquare from '../components/ImageSquare'
import { trackEvent } from '../api/telemetry'
import { Button } from '../components/UI/Button'
import { useWindowSize } from '../hooks/useWindowSize'
import ImageCard from '../components/ImagesPage/ImageCard/imageCard'
import DotsVerticalIcon from '../components/icons/DotsVerticalIcon'
import CircleCheckIcon from '../components/icons/CircleCheckIcon'
import TextButton from '../components/UI/TextButton'
import ConfirmationModal from '../components/ConfirmationModal'
import MenuButton from '../components/UI/MenuButton'
import FilterIcon from '../components/icons/FilterIcon'
import useComponentState from '../hooks/useComponentState'
import { downloadImages } from '../utils/imageUtils'
import { useSwipeable } from 'react-swipeable'
import { useEffectOnce } from '../hooks/useEffectOnce'
import MasonryLayout from '../components/MasonryLayout'
import Modal from '../components/Modal'
import SpinnerV2 from '../components/Spinner'
import DropDownMenu from '../components/UI/DropDownMenu'
import DropDownMenuItem from '../components/UI/DropDownMenuItem'
import ImageModalController from '../components/ImagesPage/ImageModalController'
import AppSettings from '../models/AppSettings'
import AdContainer from '../components/AdContainer'
import { setFilteredItemsArray } from '../store/filteredImagesCache'
import FloatingActionButton from '../components/UI/FloatingActionButton'
import TrashIcon from '../components/icons/TrashIcon'
import { useStore } from 'statery'
import { appInfoStore } from 'store/appStore'
import styles from '../styles/images.module.css'
import { IconCircleCheck, IconHeart } from '@tabler/icons-react'

const NonLink = (props: any) => {
  const { children, ...rest } = props
  return (
    <div style={{ cursor: 'pointer', position: 'relative' }} {...rest}>
      {children}
    </div>
  )
}

const ImagesPage = () => {
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (AppSettings.get('enableGallerySwipe') === false) {
        return
      }

      if (componentState.showImageModal) return
      handleLoadMore('next')
    },
    onSwipedRight: () => {
      if (AppSettings.get('enableGallerySwipe') === false) {
        return
      }

      if (componentState.showImageModal) return
      handleLoadMore('prev')
    },
    preventScrollOnSwipe: true,
    swipeDuration: 250,
    trackTouch: true,
    delta: 35
  })
  const router = useRouter()
  const size = useWindowSize()
  const appState = useStore(appInfoStore)
  const { imageDetailsModalOpen } = appState

  const [componentState, setComponentState] = useComponentState({
    deleteMode: false,
    deleteSelection: [],
    showDeleteModal: false,
    showDownloadModal: false,
    showImageModal: false,

    offset: Number(router.query.offset) || 0,
    filterMode: router.query.filter || 'all',
    layoutMode: 'layout',
    sortMode: router.query.sort || 'new',
    showFilterMenu: false,
    showLayoutMenu: false,
    totalImages: 0,
    images: [],
    isLoading: true,
    updateTimestamp: Date.now(),

    currentFilterImageIndex: 0,
    rawTotalImages: 0
  })

  const getImageCount = useCallback(async () => {
    let count
    const rawTotal = await imageCount()

    if (componentState.filterMode !== 'all') {
      count = await countFilterCompleted({
        filterType: componentState.filterMode,
        model: router.query.model as string
      })
    } else {
      count = rawTotal
    }
    setComponentState({ totalImages: count, rawTotalImages: rawTotal })
  }, [componentState.filterMode, router.query.model, setComponentState])

  const fetchImages = useCallback(async () => {
    // This is a hack to get around linting error with dependency array.
    // After an image is deleted, force update a timestamp. useCallback here
    // sees that it was updated and reruns the fetch query.
    if (!componentState.updateTimestamp) {
      return
    }

    const offset = Number(router.query.offset) || 0
    let data
    const sort = localStorage.getItem('imagePageSort') || 'new'

    if (componentState.filterMode === 'all') {
      data = await fetchCompletedJobs({ offset, sort })
    } else {
      data = await filterCompletedJobs({
        offset,
        sort,
        filterType: componentState.filterMode,
        model: router.query.model as string,
        callback: (i) => setComponentState({ currentFilterImageIndex: i })
      })
      setFilteredItemsArray(data)
    }
    await getImageCount()
    setComponentState({ images: data, isLoading: false })
  }, [
    componentState.filterMode,
    componentState.updateTimestamp,
    getImageCount,
    router.query.model,
    router.query.offset,
    setComponentState
  ])

  const handleDeleteImageClick = async () => {
    await bulkDeleteImages(componentState.deleteSelection)
    await getImageCount()
    await fetchImages()
    setComponentState({
      deleteMode: false,
      deleteSelection: [],
      showDeleteModal: false
    })
  }

  const handleLoadMore = useCallback(
    async (btn: string) => {
      setComponentState({
        isLoading: true
      })
      window.scrollTo(0, 0)
      let newNum
      if (btn === 'last') {
        const count = await countCompletedJobs()
        const sort = localStorage.getItem('imagePageSort') || 'new'
        const data = await fetchCompletedJobs({ offset: count - 100, sort })
        setComponentState({
          images: data,
          isLoading: false,
          offset: count - 100
        })

        const newQuery = Object.assign({}, router.query)
        newQuery.offset = String(count - 100)
        //@ts-ignore
        router.push(`?${new URLSearchParams(newQuery).toString()}`)
        return
      }

      if (btn === 'first') {
        const sort = localStorage.getItem('imagePageSort') || 'new'
        const data = await fetchCompletedJobs({
          offset: 0,
          sort
        })
        setComponentState({
          images: data,
          isLoading: false,
          offset: 0
        })

        const newQuery = Object.assign({}, router.query)
        delete newQuery.offset
        //@ts-ignore
        router.push(`?${new URLSearchParams(newQuery).toString()}`)
        return
      }

      if (btn === 'prev') {
        if (componentState.showImageModal) return
        newNum =
          componentState.offset - 100 < 0 ? 0 : componentState.offset - 100
      } else {
        if (componentState.showImageModal) return
        newNum =
          componentState.offset + 100 > componentState.totalImages
            ? componentState.offset
            : componentState.offset + 100
      }

      trackEvent({
        event: 'LOAD_MORE_IMAGES_CLICK',
        context: '/pages/images',
        data: {
          range: `${btn} - ${newNum}`
        }
      })

      //await fetchImages(newNum)
      setComponentState({ offset: newNum })

      const newQuery = Object.assign({}, router.query)
      newQuery.offset = newNum
      //@ts-ignore
      router.push(`?${new URLSearchParams(newQuery).toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [componentState.offset, componentState.totalImages, setComponentState]
  )

  useEffect(() => {
    fetchImages()
    getImageCount()

    if (localStorage.getItem('showLayout')) {
      setComponentState({
        layoutMode: localStorage.getItem('showLayout') || 'layout'
      })
    }
  }, [fetchImages, getImageCount, router.query, setComponentState])

  let defaultStyle = `flex gap-y-3 mt-4 relative`

  if (
    componentState.layoutMode === 'grid' ||
    componentState.layoutMode === 'layout'
  ) {
    defaultStyle += ` flex-wrap gap-x-3 justify-center md:justify-start`
  } else {
    defaultStyle += ` flex-col justify-center`
  }

  const currentOffset = componentState.offset + 1
  const maxOffset =
    componentState.offset + 100 > componentState.totalImages
      ? componentState.totalImages
      : componentState.offset + 100

  let imageColumns = 2
  // @ts-ignore
  if (size?.width > 3000) {
    imageColumns = 9
    // @ts-ignore
  } else if (size?.width > 2700) {
    imageColumns = 8
    // @ts-ignore
  } else if (size?.width > 2400) {
    imageColumns = 7
    // @ts-ignore
  } else if (size?.width > 1440) {
    imageColumns = 6
    // @ts-ignore
  } else if (size?.width > 1280) {
    imageColumns = 4
    // @ts-ignore
  } else if (size?.width > 800) {
    imageColumns = 3
  }

  const handleImageClick = useCallback(
    (e: any, id: string, jobId: string) => {
      let newArray: Array<string> = [...componentState.deleteSelection]
      if (componentState.deleteMode) {
        const index = newArray.indexOf(id)
        if (index >= 0) {
          newArray.splice(index, 1)
        } else {
          newArray.push(id)
        }

        setComponentState({ deleteSelection: newArray })
      } else {
        e.preventDefault()
        e.stopPropagation()

        setComponentState({
          showImageModal: jobId
        })
      }
    },
    [
      componentState.deleteMode,
      componentState.deleteSelection,
      setComponentState
    ]
  )

  const handleDownloadClick = async () => {
    if (componentState.deleteSelection.length === 0) {
      return
    }

    setComponentState({ showDownloadModal: true })

    const imagesToDownload: Array<any> = []

    componentState.deleteSelection.forEach((id: number) => {
      componentState.images.filter(async (image: any) => {
        if (image.id === id) {
          imagesToDownload.push(image)
        }
      })
    })

    await downloadImages(imagesToDownload)

    setComponentState({ showDownloadModal: false })
    trackEvent({
      event: 'BULK_FILE_DOWNLOAD',
      context: '/pages/images',
      data: {
        numImages: componentState.deleteSelection.length
      }
    })

    setComponentState({
      deleteMode: false,
      deleteSelection: [],
      showDeleteModal: false
    })
  }

  const handleSelectAll = () => {
    let delArray: Array<string> = [...componentState.deleteSelection]

    componentState.images.forEach((image: { id: string }) => {
      if (delArray.indexOf(image.id) === -1) {
        delArray.push(image.id)
      }
    })

    setComponentState({
      deleteSelection: delArray
    })
  }

  const handleFilterButtonClick = useCallback(() => {
    if (componentState.showFilterMenu) {
      setComponentState({ showFilterMenu: false })
    } else {
      setComponentState({
        showFilterMenu: true,
        showLayoutMenu: false
      })
    }
  }, [componentState.showFilterMenu, setComponentState])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (componentState.deleteMode && e.key === 'Escape') {
        setComponentState({
          deleteMode: false,
          deleteSelection: [],
          showDeleteModal: false
        })
      }

      if (componentState.deleteMode && e.keyCode === 13) {
        setComponentState({ showDeleteModal: true })
      } else if (
        e.key === 'ArrowLeft' &&
        componentState.showImageModal === false
      ) {
        if (componentState.showImageModal || currentOffset <= 1) return
        handleLoadMore('prev')
      } else if (
        e.key === 'ArrowRight' &&
        componentState.showImageModal === false
      ) {
        if (componentState.showImageModal) return
        handleLoadMore('next')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [
    componentState.deleteMode,
    componentState.showImageModal,
    currentOffset,
    handleLoadMore,
    setComponentState
  ])

  useEffectOnce(() => {
    trackEvent({
      event: 'PAGE_VIEW',
      context: '/pages/images'
    })
  })

  useEffect(() => {
    if (localStorage.getItem('imagePageSort') === 'old') {
      setComponentState({ sortMode: 'old' })
    } else {
      setComponentState({ sortMode: 'new' })
    }
  }, [setComponentState])

  useEffect(() => {
    const updateObject = {
      isLoading: true
    }

    // @ts-ignore
    if (router.query.model) updateObject.filterMode = 'model'
    // @ts-ignore
    if (router.query.filter) updateObject.filterMode = router.query.filter
    // @ts-ignore
    if (router.query.offset) updateObject.offset = Number(router.query.offset)
    //@ts-ignore
    if (!router.query.offset) updateObject.offset = 0
    // @ts-ignore
    if (router.query.sort) updateObject.sortMode = router.query.sort

    setComponentState(updateObject)
  }, [router.query, setComponentState])

  const LinkEl = componentState.deleteMode ? NonLink : Link

  const countDescriptor = () => {
    const descriptorMap = {
      model: `"${router?.query?.model || ''}" `,
      favorited: 'favorite ',
      unfavorited: 'unfavorited ',
      text2img: 'text2img ',
      img2img: 'img2img ',
      inpainting: 'inpainted '
    }

    return descriptorMap[
      componentState.filterMode as keyof typeof descriptorMap
    ]
  }

  return (
    <div className="relative pb-[88px]" {...handlers}>
      {componentState.deleteMode && (
        <FloatingActionButton
          onClick={() => {
            if (componentState.deleteSelection.length > 0) {
              setComponentState({ showDeleteModal: true })
            }
          }}
        >
          <TrashIcon />
          DELETE
          {componentState.deleteSelection.length > 0
            ? ` (${componentState.deleteSelection.length})?`
            : '?'}
        </FloatingActionButton>
      )}
      {componentState.showImageModal && (
        <ImageModalController
          onAfterDelete={() => {
            setComponentState({ updateTimestamp: Date.now() })
            fetchImages()
          }}
          handleClose={() => setComponentState({ showImageModal: false })}
          imageId={componentState.showImageModal}
          useFilteredItems={componentState.filterMode !== 'all'}
        />
      )}
      {componentState.showDownloadModal && (
        <Modal hideCloseButton>
          Downloading images
          <div className="flex flex-row w-full mt-4 mb-4 text-sm">
            Processing selected images for download and converting to{' '}
            {AppSettings.get('imageDownloadFormat') || 'JPG'}s. Please wait.
          </div>
          <div className="flex flex-row justify-center w-full">
            <SpinnerV2 />
          </div>
        </Modal>
      )}
      {componentState.showDeleteModal && (
        <ConfirmationModal
          multiImage={componentState.deleteSelection.length > 1}
          onConfirmClick={handleDeleteImageClick}
          closeModal={() => {
            setComponentState({
              deleteMode: false,
              deleteSelection: [],
              showDeleteModal: false
            })
          }}
        />
      )}
      <Head>
        <title>Your images - ArtBot for Stable Diffusion</title>
        <meta name="twitter:title" content="ArtBot - Your images" />
      </Head>
      <div className="flex flex-row items-center w-full">
        <div className="inline-block w-1/2">
          <PageTitle>Your images</PageTitle>
        </div>
        <div className="flex flex-row justify-end w-1/2 items-start h-[38px] relative gap-2">
          <MenuButton
            active={componentState.deleteMode}
            title="Select Images"
            onClick={() => {
              if (componentState.deleteMode) {
                setComponentState({ deleteMode: false, deleteSelection: [] })
              } else {
                setComponentState({
                  deleteMode: true,
                  showFilterMenu: false,
                  showLayoutMenu: false
                })
              }
            }}
          >
            <CircleCheckIcon size={24} />
          </MenuButton>
          <div className="relative">
            <MenuButton
              active={componentState.showFilterMenu}
              title="Filter images"
              onClick={handleFilterButtonClick}
            >
              <FilterIcon />
            </MenuButton>
            {componentState.showFilterMenu && (
              <DropDownMenu
                handleClose={() => {
                  setComponentState({
                    showFilterMenu: false
                  })
                }}
              >
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'all',
                      isLoading: componentState.filterMode !== 'all'
                    })

                    const newQuery = Object.assign({}, router.query)
                    delete newQuery.filter
                    delete newQuery.model
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  Show all images
                </DropDownMenuItem>
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'favorited',
                      isLoading: componentState.filterMode !== 'favorited'
                    })

                    const newQuery = Object.assign({}, router.query)
                    newQuery.filter = 'favorited'
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  Show favorited
                </DropDownMenuItem>
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'unfavorited',
                      isLoading: componentState.filterMode !== 'unfavorited'
                    })

                    const newQuery = Object.assign({}, router.query)
                    newQuery.filter = 'unfavorited'
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  Show unfavorited
                </DropDownMenuItem>
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'upscaled',
                      isLoading: componentState.filterMode !== 'upscaled'
                    })

                    const newQuery = Object.assign({}, router.query)
                    newQuery.filter = 'upscaled'
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  Show upscaled
                </DropDownMenuItem>
                <div className={styles['MenuSeparator']} />
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'text2img',
                      isLoading: componentState.filterMode !== 'text2img'
                    })

                    const newQuery = Object.assign({}, router.query)
                    newQuery.filter = 'text2img'
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  text2img
                </DropDownMenuItem>
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'img2img',
                      isLoading: componentState.filterMode !== 'img2img'
                    })

                    const newQuery = Object.assign({}, router.query)
                    newQuery.filter = 'img2img'
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  img2img
                </DropDownMenuItem>
                <DropDownMenuItem
                  onClick={() => {
                    setComponentState({
                      filterMode: 'inpainting',
                      isLoading: componentState.filterMode !== 'inpainting'
                    })

                    const newQuery = Object.assign({}, router.query)
                    newQuery.filter = 'inpainting'
                    router.push(
                      //@ts-ignore
                      `?${new URLSearchParams(newQuery).toString()}`
                    )
                  }}
                >
                  inpainting
                </DropDownMenuItem>
              </DropDownMenu>
            )}
          </div>
          <MenuButton
            active={componentState.showLayoutMenu}
            title="Change layout"
            onClick={() => {
              if (componentState.showLayoutMenu) {
                setComponentState({
                  showLayoutMenu: false
                })
              } else {
                setComponentState({
                  showFilterMenu: false,
                  showLayoutMenu: true
                })
              }
            }}
          >
            <DotsVerticalIcon size={24} />
          </MenuButton>
          {componentState.showLayoutMenu && (
            <DropDownMenu
              handleClose={() => {
                setComponentState({ showLayoutMenu: false })
              }}
            >
              {/* <MenuItem>Select images...</MenuItem>
                <MenuSeparator /> */}
              <DropDownMenuItem
                onClick={() => {
                  setComponentState({
                    layoutMode: 'grid'
                  })
                  localStorage.setItem('showLayout', 'grid')
                  trackEvent({
                    event: `MENU_CLICK`,
                    action: 'grid_view',
                    context: '/pages/images'
                  })
                }}
              >
                Square Grid
              </DropDownMenuItem>
              <DropDownMenuItem
                onClick={() => {
                  setComponentState({
                    layoutMode: 'layout'
                  })
                  localStorage.setItem('showLayout', 'layout')
                  trackEvent({
                    event: `MENU_CLICK`,
                    action: 'layout_view',
                    context: '/pages/images'
                  })
                }}
              >
                Dynamic Layout
              </DropDownMenuItem>
              <div className={styles['MenuSeparator']} />
              <DropDownMenuItem
                onClick={() => {
                  setComponentState({
                    isLoading: true,
                    sortMode: 'new'
                  })
                  localStorage.setItem('imagePageSort', 'new')
                  fetchImages()

                  const newQuery = Object.assign({}, router.query)
                  delete newQuery.sort
                  //@ts-ignore
                  router.push(`?${new URLSearchParams(newQuery).toString()}`)

                  trackEvent({
                    event: `MENU_CLICK`,
                    action: 'sort_new',
                    context: '/pages/images'
                  })
                }}
              >
                Sort by Newest
              </DropDownMenuItem>
              <DropDownMenuItem
                onClick={() => {
                  setComponentState({
                    isLoading: true,
                    sortMode: 'old'
                  })
                  localStorage.setItem('imagePageSort', 'old')
                  fetchImages()

                  const newQuery = Object.assign({}, router.query)
                  newQuery.sort = 'old'
                  //@ts-ignore
                  router.push(`?${new URLSearchParams(newQuery).toString()}`)

                  trackEvent({
                    event: `MENU_CLICK`,
                    action: 'sort_old',
                    context: '/pages/images'
                  })
                }}
              >
                Sort by Oldest
              </DropDownMenuItem>
            </DropDownMenu>
          )}
        </div>
      </div>
      <div className="mb-2 text-sm">
        <strong>Important:</strong> All images persist within your local browser
        cache and are not stored on a remote server. Clearing your cache will{' '}
        <strong>delete</strong> all images.
      </div>
      <div className="flex flex-row justify-between w-full">
        {!componentState.deleteMode && componentState.totalImages > 0 && (
          <div className="mb-2 text-sm text-teal-500">
            Showing {currentOffset} - {maxOffset} of{' '}
            <strong>{componentState.totalImages}</strong> {countDescriptor()}
            images {componentState.sortMode === 'new' && `(↓ newest)`}
            {componentState.sortMode === 'old' && `(↓ oldest)`}
          </div>
        )}
        {componentState.deleteMode && (
          <>
            <div className="mb-2 text-sm text-teal-500">
              selected ({componentState.deleteSelection.length})
            </div>
            <div className={styles['ButtonContainer']}>
              <TextButton
                onClick={() => {
                  setComponentState({ deleteMode: false, deleteSelection: [] })
                }}
                tabIndex={0}
              >
                cancel
              </TextButton>
              <TextButton
                onClick={() => {
                  handleSelectAll()
                }}
                tabIndex={0}
              >
                select all
              </TextButton>
              <TextButton onClick={handleDownloadClick} tabIndex={0}>
                download
              </TextButton>
              <TextButton
                color="red"
                onClick={() => {
                  if (componentState.deleteSelection.length > 0) {
                    setComponentState({ showDeleteModal: true })
                  }
                }}
                tabIndex={0}
              >
                delete
              </TextButton>
            </div>
          </>
        )}
      </div>
      {!componentState.isLoading &&
        componentState.images.length === 0 &&
        componentState.filterMode !== 'all' && (
          <div className="mt-2 mb-2">
            No {countDescriptor()} images found for this filter.{' '}
            <Link
              href="/images"
              className="text-cyan-400"
              onClick={() => {
                setComponentState({
                  deleteMode: false,
                  filterMode: 'all',
                  showFilterMenu: false,
                  showLayoutMenu: false
                })
              }}
            >
              Reset filter and show all images.
            </Link>
          </div>
        )}
      {!componentState.isLoading &&
        componentState.images.length === 0 &&
        componentState.filterMode === 'all' && (
          <div className="mt-2 mb-2">
            You haven&apos;t created any images yet.{' '}
            <Link href="/" className="text-cyan-400">
              Why not create something?
            </Link>
          </div>
        )}
      {
        //@ts-ignore
        size && size.width < 890 && !imageDetailsModalOpen && (
          <div className="w-full">
            <AdContainer minSize={0} maxSize={640} key={router.asPath} />
          </div>
        )
      }

      {componentState.isLoading && <Spinner />}
      <div className={defaultStyle}>
        {!componentState.isLoading &&
          componentState.images.length > 0 &&
          componentState.layoutMode === 'layout' && (
            <MasonryLayout columns={imageColumns} gap={8}>
              {componentState.images.map(
                (image: {
                  id: string
                  favorited: boolean
                  jobId: string
                  base64String: string
                  thumbnail: string
                  prompt: string
                  timestamp: number
                  seed: number
                }) => {
                  return (
                    <LazyLoad key={image.jobId} once>
                      <div className="relative">
                        <LinkEl
                          href={`/image/${image.jobId}`}
                          passHref
                          onClick={(e) =>
                            handleImageClick(e, image.id, image.jobId)
                          }
                          tabIndex={0}
                        >
                          <img
                            src={
                              'data:image/webp;base64,' +
                              (image.thumbnail || image.base64String)
                            }
                            style={{
                              borderRadius: '4px',
                              width: '100%',
                              display: 'block'
                            }}
                            alt={image.prompt}
                          />
                          {componentState.deleteMode &&
                            componentState.deleteSelection.indexOf(image.id) >=
                              0 && (
                              <div className={styles['ImageOverlay']}></div>
                            )}
                          {componentState.deleteMode &&
                            componentState.deleteSelection.indexOf(image.id) ===
                              -1 && (
                              <IconCircleCheck
                                className={styles['SelectCheck']}
                              />
                            )}
                          {componentState.deleteMode &&
                            componentState.deleteSelection.indexOf(image.id) >=
                              0 && (
                              <IconCircleCheck
                                fill="blue"
                                color="white"
                                className={styles['SelectCheck']}
                              />
                            )}
                          {image.favorited && (
                            <IconHeart
                              className={styles['StyledHeartIcon']}
                              fill="#14B8A6"
                              width={1}
                              size={32}
                            />
                          )}
                        </LinkEl>
                      </div>
                    </LazyLoad>
                  )
                }
              )}
            </MasonryLayout>
          )}
        {!componentState.isLoading &&
          componentState.images.length > 0 &&
          componentState.layoutMode === 'grid' && (
            <>
              {componentState.images.map(
                (image: {
                  id: string
                  jobId: string
                  base64String: string
                  thumbnail: string
                  prompt: string
                  timestamp: number
                  seed: number
                  favorited: boolean
                }) => {
                  return (
                    <LazyLoad key={image.jobId} once>
                      <div className="relative">
                        <LinkEl
                          href={`/image/${image.jobId}`}
                          passHref
                          onClick={(e) =>
                            handleImageClick(e, image.id, image.jobId)
                          }
                          tabIndex={0}
                        >
                          <ImageSquare
                            imageDetails={image}
                            imageType={'image/webp'}
                          />
                          {componentState.deleteMode &&
                            componentState.deleteSelection.indexOf(image.id) >=
                              0 && (
                              <div className={styles['ImageOverlay']}></div>
                            )}
                          {componentState.deleteMode &&
                            componentState.deleteSelection.indexOf(image.id) ===
                              -1 && (
                              <IconCircleCheck
                                className={styles['SelectCheck']}
                              />
                            )}
                          {componentState.deleteMode &&
                            componentState.deleteSelection.indexOf(image.id) >=
                              0 && (
                              <IconCircleCheck
                                fill="blue"
                                color="white"
                                className={styles['SelectCheck']}
                              />
                            )}
                          {image.favorited && (
                            <IconHeart
                              className={styles['StyledHeartIcon']}
                              fill="#14B8A6"
                              width={1}
                              size={32}
                            />
                          )}
                        </LinkEl>
                      </div>
                    </LazyLoad>
                  )
                }
              )}
            </>
          )}
        {!componentState.isLoading &&
          componentState.images.length > 0 &&
          componentState.layoutMode === 'list' &&
          componentState.images.map(
            (image: {
              jobId: string
              base64String: string
              thumbnail: string
              prompt: string
              timestamp: number
              seed: number
              height: number
              width: number
            }) => {
              return (
                <ImageCard
                  key={image.jobId}
                  imageDetails={image}
                  handleDeleteImageClick={handleDeleteImageClick}
                />
              )
            }
          )}
      </div>
      {!componentState.isLoading && componentState.totalImages > 100 && (
        <div className="flex flex-row justify-center gap-2 mt-4">
          <Button
            disabled={componentState.offset === 0}
            onClick={() => handleLoadMore('first')}
            width="52px"
          >
            First
          </Button>
          <Button
            disabled={componentState.offset === 0}
            onClick={() => handleLoadMore('prev')}
            width="52px"
          >
            Prev
          </Button>
          <Button
            disabled={currentOffset >= componentState.totalImages - 99}
            onClick={() => handleLoadMore('next')}
            width="52px"
          >
            Next
          </Button>
          <Button
            disabled={currentOffset >= componentState.totalImages - 99}
            onClick={() => handleLoadMore('last')}
            width="52px"
          >
            Last
          </Button>
        </div>
      )}
    </div>
  )
}

export default ImagesPage
