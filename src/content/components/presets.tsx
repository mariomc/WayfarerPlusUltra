import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'

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

import type { PresetConfig, PresetConfigScore, PresetScoreKey } from '../config'
import { applyPreset, getFilledInValue } from '../utils'

type PresetProps = {
  config: PresetConfig
}

type PresetsProps = {
  presets: Array<PresetConfig>
}

const LOCAL_STORAGE_KEY = 'wfpu_presets'

const getLS = (key: string): Array<PresetConfig> => {
  try {
    const unparsed = localStorage.getItem(key)
    const parsed = unparsed ? JSON.parse(unparsed) : []
    return parsed as Array<PresetConfig>
  } catch (ex) {
    return []
  }
}

const setLS = (key: string, value: Array<PresetConfig>): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (ex) {
    console.log('Error writing to local storage')
  }
}

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === 0
    ) {
      delete obj[propName]
    }
  }
  return obj
}

const getNewValues = (): PresetConfigScore => {
  const toRet: PresetConfigScore = {
    cultural: getFilledInValue('cultural'),
    description: getFilledInValue('description'),
    location: getFilledInValue('location'),
    quality: getFilledInValue('quality'),
    safety: getFilledInValue('safety'),
    uniqueness: getFilledInValue('uniqueness'),
  }

  return clean(toRet)
}

const formatPresetAsText = (config: PresetConfig): string => {
  const { score } = config
  const scores = (Object.keys(score) as Array<PresetScoreKey>).map((label:PresetScoreKey) => `${label}:${score[label]}`)
  if (config.rng) {
    scores.push(`rng:true`)
  }
  return scores.join('\n')
}

const Preset = ({ config }: PresetProps): JSX.Element => (
  <Tooltip title={formatPresetAsText(config)}>
    <Button onClick={() => applyPreset(config)} variant="text">
      {config.name}
    </Button>
  </Tooltip>
)

const Random = () => (
  <Tooltip title="Shuffle" aria-label="add">
    <Icon fontSize="small">shuffle</Icon>
  </Tooltip>
)

const PresetsTable = ({ presets }: PresetsProps): JSX.Element => {
  return (
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
          {presets.map((preset, index) => (
            <TableRow key={preset.name} selected={index === presets.length - 1}>
              <TableCell component="th" scope="row">
                {preset.name}
              </TableCell>
              <TableCell align="center">
                {preset.score.quality}
                {preset.rng}
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
  )
}

const getNewPresetDefaults = (): PresetConfig => ({
  name: 'New Preset',
  rng: false,
  score: {},
})

export const Presets = (): JSX.Element => {
  const savedPresets = getLS(LOCAL_STORAGE_KEY) as Array<PresetConfig>
  const [presets, setPresets] = useState(savedPresets)
  const [open, setOpen] = useState(false)
  const [newPreset, setNewPreset] = useState(getNewPresetDefaults())

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
    setNewPreset({ ...newPreset, score: getNewValues() })
  }

  const handleSave = () => {
    const newPresets = [...presets, newPreset]
    setPresets(newPresets)
    setNewPreset(getNewPresetDefaults())
    setLS(LOCAL_STORAGE_KEY, newPresets)
    setOpen(false)
  }

  const setRng = (val: boolean) => {
    setNewPreset({ ...newPreset, rng: !val })
  }

  // Changing the padding
  useEffect(() => {
    document.body.style.paddingBottom = '64px'
    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [])

  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: 'white' }}
      sx={{ top: 'auto', bottom: 0 }}
    >
      <Toolbar>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          {presets?.map((presetConfig) => (
            <Preset key={presetConfig.name} config={presetConfig} />
          ))}
        </ButtonGroup>
        <Tooltip title="Add" aria-label="add">
          <Fab color="primary" onClick={handleOpen}>
            <Icon>add_circle</Icon>
          </Fab>
        </Tooltip>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Current Presets</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            TL;DR
          </DialogContentText> */}
            <PresetsTable presets={[...presets, newPreset]} />
            <FormGroup row>
              <TextField
                value={newPreset.name}
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                inputProps={{ autoComplete: 'false' }}
                onChange={(ev) =>
                  setNewPreset({ ...newPreset, name: ev.target.value })
                }
                fullWidth
              />
              <FormControlLabel
                checked={newPreset.rng}
                onChange={() => setRng(Boolean(newPreset.rng))}
                control={<Switch name="checkedB" color="primary" />}
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
      </Toolbar>
    </AppBar>
  )
}
