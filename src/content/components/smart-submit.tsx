import React, { useEffect } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'

export const SmartSubmit = (): JSX.Element => {
  useEffect(() => {

  }, [])
  return (
    <Tooltip title="Smart Submit">
      <Fab
        color="primary"
        onClick={() => {
          const submitButton = document.querySelector(
            'app-submit-review-split-button .wf-split-button__main',
          )

          if (submitButton) {
            if (submitButton.disabled) {
              alert('Still disabled')
            } else {
              submitButton?.click?.()
            }
          }
        }}
      >
        <Icon>send</Icon>
      </Fab>
    </Tooltip>
  )
}
