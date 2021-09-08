import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'

import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'

export const ReviewCells = (): JSX.Element | null => {

  const handleClick = () => {
    window.postMessage(
      { sender: 'wfpu', type: 'reviewCells' },
      window.location.origin,
    )
  }

  return (
    <>
      <Tooltip title="Apply Map Mods">
        <Fab color="primary" size="small" onClick={handleClick} sx={{ marginLeft: 1 }}>
          <Icon>map</Icon>
        </Fab>
      </Tooltip>
    </>
  )
}
