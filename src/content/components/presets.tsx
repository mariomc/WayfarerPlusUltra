import React, { memo, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import type { GridCellEditCommitParams } from '@material-ui/data-grid'

import DialogContentText from '@material-ui/core/DialogContentText'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import DialogTitle from '@material-ui/core/DialogTitle'
import Icon from '@material-ui/core/Icon'

import { PresetsTable } from './presets-table'
import { SmartSubmit } from './smart-submit'
import { ReviewCells } from './review-cells'
import type { PresetConfig, PresetScoreKey, FlatPreset } from '../config'
import { applyPreset } from '../utils'

type PresetProps = {
  config: PresetConfig
}

type FlatPresetMap = {
  [key: string]: FlatPreset
}

const LOCAL_STORAGE_KEY = 'wfpu_presets'

const getLS = (key: string): PresetConfig[] => {
  try {
    const unparsed = localStorage.getItem(key)
    const parsed = unparsed ? JSON.parse(unparsed) : []
    return parsed as PresetConfig[]
  } catch (ex) {
    return []
  }
}

const setLS = (key: string, value: PresetConfig[]): void => {
  try {
    const toSet = JSON.stringify(value)
    localStorage.setItem(key, toSet)
  } catch (ex) {
    console.log('Error writing to local storage')
  }
}

const formatPresetAsText = (config: PresetConfig): string => {
  const { score } = config
  const scores = (Object.keys(score) as Array<PresetScoreKey>).map(
    (label: PresetScoreKey) => `${label}:${score[label]}`,
  )
  if (config.rng) {
    scores.push('rng:true')
  }
  return scores.join(';')
}

const mapPreset = (edit: FlatPreset): PresetConfig => {
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const { name, id, rng, ...score } = edit

  return {
    name,
    rng,
    score,
  }
}

const applyEditsToPresets = (
  edits: FlatPresetMap,
  presets: PresetConfig[],
): PresetConfig[] => {
  const editedPresets = presets.map((preset, index) => {
    const edit = edits[index] as FlatPreset
    if (!edit) {
      return preset
    }

    const editedPreset = mapPreset(edit)

    return {
      ...preset,
      ...editedPreset,
      score: {
        ...preset.score,
        ...editedPreset.score,
      },
    }
  })
  const newPresets = Object.keys(edits)
    .filter((id) => id?.includes('new'))
    .map((key) => edits[key])
    .map(mapPreset)

  return [...editedPresets, ...newPresets].filter((preset) =>
    Boolean(preset.name),
  )
}

const Preset = ({ config }: PresetProps): JSX.Element => {
  return (
    <Tooltip title={formatPresetAsText(config)}>
      <Button onClick={() => applyPreset(config)} variant="text">
        {config.name}
      </Button>
    </Tooltip>
  )
}

const getStoredPresets = (): PresetConfig[] => {
  return getLS(LOCAL_STORAGE_KEY) as PresetConfig[]
}

const PresetsNoMemo = (): JSX.Element => {
  const [changes, setChanges] = useState<FlatPresetMap>({} as FlatPresetMap)
  const [presets, setPresets] = useState<PresetConfig[]>(getStoredPresets())
  const [open, setOpen] = useState<boolean>(false)

  const cleanUp = () => {
    setChanges({} as FlatPresetMap)
    setPresets(getStoredPresets())
  }

  const handleClose = () => {
    setOpen(false)
    cleanUp()
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleSave = () => {
    const newPresets = applyEditsToPresets(changes, presets)
    setLS(LOCAL_STORAGE_KEY, newPresets)
    setPresets(newPresets)
    setOpen(false)
    setTimeout(cleanUp, 10)
  }

  const handleChange = (model: GridCellEditCommitParams) => {
    const newChanges = {
      ...changes,
      [model.id]: {
        ...changes[model.id],
        [model.field]: model.value,
      },
    }
    setChanges(newChanges)
  }

  // Changing the padding
  useEffect(() => {
    document.body.style.paddingBottom = '64px'
    return () => {
      document.body.style.paddingBottom = ''
    }
  })

  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: 'white' }}
      sx={{ top: 'auto', bottom: 0 }}
    >
      <Toolbar>
        <ButtonGroup color="primary">
          {presets?.map((presetConfig, index) => (
            <Preset
              key={`${presetConfig.name}-${index}`}
              config={presetConfig}
            />
          ))}
        </ButtonGroup>
        <Tooltip title="Edit Presets">
          <Fab color="secondary" size="small" onClick={handleOpen}>
            <Icon>settings</Icon>
          </Fab>
        </Tooltip>
        <SmartSubmit />
        <ReviewCells />
        <Dialog
          fullWidth
          maxWidth="xl"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Current Presets</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create new presets by editing the empty lines. Edit the presets by
              double-clicking the fields. Remove them by deleting their title.
              Commit the changes by saving.
            </DialogContentText>
            <PresetsTable presets={presets} onChange={handleChange} />
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

export const Presets = memo(PresetsNoMemo)
