import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import DialogTitle from '@material-ui/core/DialogTitle'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
// import AddCircle from '@material-ui/icons/AddCircle'
import Icon from '@material-ui/core/Icon'

import { PresetConfig } from '../config'
import { applyPreset } from '../utils'

type PresetProps = {
  config: PresetConfig
}

type PresetsProps = {
  presets: Array<PresetConfig>
}

const createPreset = (): PresetConfig => {
  return {
    name: 'Full 5',
    score: {
      cultural: 5,
      description: 5,
      location: 5,
      quality: 5,
      safety: 5,
      uniqueness: 5,
      what: 5,
    },
  } as PresetConfig
}

const Preset = ({ config }: PresetProps): JSX.Element => (
  <Button onClick={() => applyPreset(config)} variant="outlined">
    {config.name}
  </Button>
)

const Random = () => <Tooltip title="Shuffle" aria-label="add"><Icon fontSize="small">shuffle</Icon></Tooltip>

export const Presets = ({ presets: p }: PresetsProps): JSX.Element => {
  const [presets, setPresets] = useState(p)
  const [open, setOpen] = useState(false)
  const [rng, setRng] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleSave = () => {
    setOpen(false)
    const newPreset = createPreset()
    setPresets([...presets, newPreset])
  }

  return (
    <div>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {presets?.map((presetConfig) => (
          <Preset key={presetConfig.name} config={presetConfig} />
        ))}
      </ButtonGroup>
      <Tooltip title="Add" aria-label="add">
        <Fab color="primary" onClick={handleOpen}>
          {/* <AddCircle /> */}
          <Icon>add_circle</Icon>
        </Fab>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Preset</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            TL;DR
          </DialogContentText> */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quality</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Cultural</TableCell>
                  <TableCell>Uniqueness</TableCell>
                  <TableCell>Safety</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presets.map((preset) => (
                  <TableRow key={preset.name}>
                    <TableCell component="th" scope="row">
                      {preset.name}
                    </TableCell>
                    <TableCell align="center">
                      {preset.score.quality}
                      {preset.rng && <Random />}
                    </TableCell>
                    <TableCell align="center">
                      {preset.score.description}
                      {preset.rng && <Random />}
                    </TableCell>
                    <TableCell align="center">
                      {preset.score.cultural}
                      {preset.rng && <Random />}
                    </TableCell>
                    <TableCell align="center">
                      {preset.score.uniqueness}
                      {preset.rng && <Random />}
                    </TableCell>
                    <TableCell align="center">{preset.score.safety}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <FormGroup row>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              inputProps={{ autoComplete: 'false' }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={rng}
                  onChange={() => setRng(!rng)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Random"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
