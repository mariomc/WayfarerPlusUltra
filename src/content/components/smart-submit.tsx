import React, { useEffect, useState, useCallback } from 'react'
import { useContextSelector } from 'use-context-selector'
import Tooltip from '@material-ui/core/Tooltip'
import Badge from '@material-ui/core/Badge'

import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'

import { AppContext } from '../state'
import { selectors } from '../config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expiresSelector = (state: any): number | null => {
  return state?.review?.reviewData?.data?.expires
}

const timeFromMs = (ms: number) => {
  return new Intl.DateTimeFormat('default', {
    minute: 'numeric',
    second: 'numeric',
  }).format(new Date(ms))
}

const Timer = ({ expires }: { expires: number }): JSX.Element => {
  const [delta, setDelta] = useState(expires - new Date().valueOf())

  useEffect(() => {
    const cb = () => {
      setDelta(expires - new Date().valueOf())
    }
    const interval = setInterval(cb, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [expires])

  const formattedDelta = delta > 0 ? timeFromMs(delta) : `Expired`

  return <>{formattedDelta}</>
}

export const SmartSubmit = (): JSX.Element | null => {
  const expires = useContextSelector(AppContext, expiresSelector)
  const [submitted, setSubmitted] = useState(false)
  const handleClick = useCallback(() => {
    const submitButton = document.querySelector(
      selectors.smartSubmit.submit,
    ) as HTMLButtonElement

    if (submitButton) {
      if (submitButton.disabled) {
        const option = document.querySelector(
          selectors.smartSubmit.what,
        ) as HTMLButtonElement
        option?.click?.()
      }
      submitButton?.click?.()
      setSubmitted(true)
    }
  }, [expires])

  if (!expires || submitted) {
    return null
  }

  return (
    <Tooltip title="Smart Submit">
      <Fab
        color="primary"
        onClick={handleClick}
        sx={{
          position: 'absolute',
          right: 16,
        }}
      >
        <Badge color="secondary" badgeContent={<Timer expires={expires} />}>
          <Icon>send</Icon>
        </Badge>
      </Fab>
    </Tooltip>
  )
}
