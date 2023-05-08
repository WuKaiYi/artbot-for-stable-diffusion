import clsx from 'clsx'
import { toast } from 'react-toastify'
import { fetchUserDetails } from '../../api/userInfo'
import AppSettings from '../../models/AppSettings'
import { setWorker } from '../../store/userStore'
import { clientHeader, getApiHostServer } from '../../utils/appUtils'
import { formatSeconds } from '../../utils/helperUtils'
import { sleep } from '../../utils/sleep'
import CheckboxIcon from '../icons/CheckboxIcon'
import ChevronDownIcon from '../icons/ChevronDownIcon'
import ChevronRightIcon from '../icons/ChevronRightIcon'
import CopyIcon from '../icons/CopyIcon'
import PauseIcon from '../icons/PauseIcon'
import PlayIcon from '../icons/PlayIcon'
import PointIcon from '../icons/PointIcon'
import SquareIcon from '../icons/SquareIcon'
import { Button } from '../UI/Button'

import styles from './workerInfo.module.css'

const Spacer = () => {
  return <div style={{ marginBottom: '8px' }}></div>
}

const WorkerInfo = ({
  forceUpdate,
  editable,
  loadingWorkerStatus,
  setComponentState,
  showModels,
  showModelClick,
  worker,
  workers
}: any) => {
  let statusColor = 'green'
  if (worker.online && worker.maintenance_mode) {
    statusColor = 'orange'
  } else if (!worker.online) {
    statusColor = 'red'
  }

  const handleWorkerChange = async ({ state }: any) => {
    const { id } = worker
    const updateWorkerLoadingState = { ...loadingWorkerStatus }
    loadingWorkerStatus[id] = true

    const optimisticWorkerData = { ...workers }
    optimisticWorkerData[id].maintenance_mode = state === 'pause' ? true : false

    setComponentState({
      loadingWorkerStatus: { ...updateWorkerLoadingState }
    })

    const workerDetails = { ...workers[id] }

    // TODO: Handle and make visible any errors.
    // Optimistically set worker state.
    setWorker({
      ...workerDetails,
      maintenance_mode: state === 'pause' ? true : false
    })

    await fetch(`${getApiHostServer()}/api/v2/workers/${id}`, {
      body: JSON.stringify({
        maintenance: state === 'pause' ? true : false,
        name: worker.name,
        team: worker.team?.id ?? ''
      }),
      // @ts-ignore
      headers: {
        apikey: AppSettings.get('apiKey'),
        'Content-Type': 'application/json',
        'Client-Agent': clientHeader()
      },
      method: 'PUT'
    })

    await sleep(1000)

    await fetchUserDetails(AppSettings.get('apiKey'))

    loadingWorkerStatus[id] = false
    setComponentState({ loadingWorkerStatus: { ...updateWorkerLoadingState } })
  }

  return (
    <div
      className={clsx(styles.wrapper, showModels && styles['expand-panel'])}
      key={worker.id}
    >
      <div>
        <div className={styles['worker-title']}>
          <a
            // @ts-ignore
            name={worker.id}
          />
          <PointIcon size={28} fill={statusColor} stroke={statusColor} />
          <strong>{worker.name}</strong>
        </div>
        <div
          className={styles['worker-id']}
          onClick={() => {
            navigator?.clipboard?.writeText(`${worker.id}`).then(() => {
              toast.success('Worker ID copied!', {
                pauseOnFocusLoss: false,
                position: 'top-center',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'light'
              })
            })
          }}
        >
          <CopyIcon />
          id: {worker.id}
        </div>
        {worker.info && (
          <div className="mt-2 text-sm italic">{worker.info}</div>
        )}
        <div className={styles['worker-status']}>
          <div>
            Status:{' '}
            <strong>
              {worker.online && worker.maintenance_mode && 'Paused'}
              {worker.online && !worker.maintenance_mode && 'Online'}
              {!worker.online && 'Offline'}
            </strong>
          </div>
          <div>
            Total uptime: <strong>{formatSeconds(worker.uptime)}</strong>
          </div>
          <Spacer />
          <div>
            Threads: <strong>{worker.threads}</strong>
          </div>
          <div>
            Max resolution (1:1):{' '}
            <strong>
              {Math.floor(Math.sqrt(worker.max_pixels))} x{' '}
              {Math.floor(Math.sqrt(worker.max_pixels))}
            </strong>
          </div>
          <div>
            Max pixels: <strong>{worker.max_pixels?.toLocaleString()}</strong>
          </div>
          <div>
            Performance: <strong>{worker.performance}</strong>
          </div>
          <div>
            Avg time per request:{' '}
            <strong>
              {worker.requests_fulfilled > 0
                ? `${Number(worker.uptime / worker.requests_fulfilled).toFixed(
                    4
                  )} seconds`
                : 'N/A'}
            </strong>
          </div>
          <Spacer />
          <div>
            Kudos earned:{' '}
            <strong>{worker?.kudos_rewards?.toLocaleString()}</strong>
          </div>
          <div>
            Requests completed:{' '}
            <strong>{worker.requests_fulfilled?.toLocaleString()}</strong>
          </div>
          <Spacer />
          <table>
            <tbody>
              <tr>
                <td>Inpainting:&nbsp;&nbsp;</td>
                <td>{<strong>{worker?.painting ? '✔️' : '❌'}</strong>}</td>
              </tr>
              <tr>
                <td>NSFW:&nbsp;&nbsp;</td>
                <td>{<strong>{worker?.nsfw ? '✔️' : '❌'}</strong>}</td>
              </tr>
              <tr>
                <td>Post-processing:&nbsp;&nbsp;</td>
                <td>
                  <strong>{worker['post-processing'] ? '✔️' : '❌'}</strong>
                </td>
              </tr>
              <tr>
                <td>Trusted:&nbsp;&nbsp;</td>
                <td>
                  <strong>{worker.trusted ? '✔️' : '❌'}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <Spacer />
        </div>
      </div>

      <div
        className={clsx(
          styles['use-worker-row'],
          showModels && styles['worker-row-padding']
        )}
      >
        {AppSettings.get('useWorkerId') === worker.id ? (
          <Button
            theme="secondary"
            onClick={() => {
              AppSettings.save('useWorkerId', '')
              forceUpdate()
            }}
          >
            <CheckboxIcon />
            Return to using all workers
          </Button>
        ) : (
          <Button
            onClick={() => {
              AppSettings.save('useWorkerId', worker.id)
              forceUpdate()
            }}
          >
            <SquareIcon />
            Use this worker for all jobs
          </Button>
        )}
      </div>
      {editable !== false && worker.online && (
        <div className="mt-4">
          {worker.online && !worker.maintenance_mode && (
            <Button
              theme="secondary"
              disabled={loadingWorkerStatus[worker.id]}
              onClick={() => {
                handleWorkerChange({
                  state: 'pause'
                })
              }}
            >
              {loadingWorkerStatus[worker.id] ? (
                'Updating...'
              ) : (
                <>
                  <PauseIcon /> Pause worker
                </>
              )}
            </Button>
          )}
          {worker.online && worker.maintenance_mode && (
            <Button
              disabled={loadingWorkerStatus[worker.id]}
              onClick={() => {
                handleWorkerChange({
                  state: 'start'
                })
              }}
            >
              {loadingWorkerStatus[worker.id] ? (
                'Updating...'
              ) : (
                <>
                  <PlayIcon /> Re-start worker
                </>
              )}
            </Button>
          )}
        </div>
      )}

      <Spacer />

      <div className={styles['expand-models']} onClick={showModelClick}>
        {showModels ? <ChevronDownIcon /> : <ChevronRightIcon />}
        Models ({worker?.models?.length ?? 0})
      </ExpandModels>
    </div>
  )
}

export default WorkerInfo
