import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { PresetConfig } from '../config'
import { applyPreset } from '../utils'

type PresetProps = {
  config: PresetConfig
}

type PresetsProps = {
  presets: Array<PresetConfig>
}

const Preset = ({ config }: PresetProps): JSX.Element => (
  <Button onClick={() => applyPreset(config)} variant="outlined">
    {config.name}
  </Button>
)

export const Presets = ({ presets: p }: PresetsProps): JSX.Element => {
  const [presets, setPresets] = useState(p)
  return (
    <>
      {presets?.map((presetConfig) => (
        <Preset key={presetConfig.name} config={presetConfig} />
      ))}
      <Button
        onClick={() => setPresets([...presets, presets[presets.length - 1]])}
        variant="outlined"
      >
        +
      </Button>
    </>
  )
}
