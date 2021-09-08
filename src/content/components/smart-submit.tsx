import React, {
  CSSProperties,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import { useContextSelector } from 'use-context-selector'
import Tooltip from '@material-ui/core/Tooltip'
import Badge from '@material-ui/core/Badge'

import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/core/Alert'

import { AppContext } from '../state'
import { selectors } from '../config'
import { getWaitingTime } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expiresSelector = (state: any): number => {
  return state?.review?.reviewData?.data?.expires || 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidSelector = (state: any): number | null => {
  return state?.review?.reviewResponse?.isValid
}

const timeFormat = {
  minute: 'numeric',
  second: 'numeric',
} as Intl.DateTimeFormatOptions

const timeFromMs = (ms: number) => {
  return new Intl.DateTimeFormat('default', timeFormat).format(new Date(ms))
}

const getDelta = (expires: number) => expires - new Date().valueOf()

const style = {
  position: 'absolute',
  right: '16px',
} as CSSProperties

const Countdown = ({
  initialCount,
  invalidValue = '',
}: {
  initialCount: number
  invalidValue?: string
}): JSX.Element => {
  const [counter, setCounter] = useState(initialCount)
  const STEP = 1000

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextStep = counter - STEP
      setCounter(Math.max(0, nextStep))
    }, STEP)

    return () => {
      clearTimeout(timeoutId)
    }
  })

  return <>{initialCount <= 0 ? invalidValue : timeFromMs(counter)}</>
}

const Timer = ({ expires }: { expires: number }): JSX.Element => {
  return <Countdown initialCount={getDelta(expires)} invalidValue="Expired" />
}

const clickOnFirstEditOption = false // TODO: Change this into the preset. Here to test only

const clickOnSubmit = (callback: (value: boolean) => void) => {
  const submitButton = document.querySelector(
    selectors.smartSubmit.submit,
  ) as HTMLButtonElement

  if (submitButton) {
    if (clickOnFirstEditOption) {
      const option = document.querySelector(
        selectors.smartSubmit.what,
      ) as HTMLButtonElement
      option?.click?.()
    }
    submitButton?.click?.()
    callback(true)
  }
}

export const SmartSubmit = (): JSX.Element | null => {
  const expires = useContextSelector(AppContext, expiresSelector)
  const isValid = useContextSelector(AppContext, isValidSelector)
  const timerRef = useRef(0)
  const [submitted, setSubmitted] = useState(false)
  const [waitingTime, setWaiting] = useState(0)

  const handleClick = useCallback(() => {
    const waitingMs = getWaitingTime(expires)

    setWaiting(waitingMs)

    timerRef.current = window.setTimeout(() => {
      clickOnSubmit(setSubmitted)
      setWaiting(0)
    }, waitingMs)
  }, [expires])

  useEffect(() => {
    setSubmitted(false)
    setWaiting(0)
    window.clearTimeout(timerRef.current)
    timerRef.current = 0

    return () => {
      window.clearTimeout(timerRef.current)
      timerRef.current = 0
    }
  }, [expires])

  if (!expires || submitted) {
    return null
  }

  return (
    <>
      <Snackbar
        open={waitingTime > 0}
        sx={{ bottom: 60 }}
        autoHideDuration={waitingTime}
      >
        <Alert severity="info">
          Submitting in: <Countdown initialCount={waitingTime} />
        </Alert>
      </Snackbar>
      <Tooltip title="Smart Submit">
        <span style={style}>
          <Fab color="primary" disabled={!isValid} onClick={handleClick}>
            <Badge color="secondary" badgeContent={<Timer expires={expires} />}>
              <Icon>send</Icon>
            </Badge>
          </Fab>
        </span>
      </Tooltip>
    </>
  )
}
