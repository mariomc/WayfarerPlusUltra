import React from 'react'
import { presets } from './config'
import { applyPreset, PresetConfig } from './utils'

interface PresetProps {
  config: PresetConfig
}

const Preset = ({ config }: PresetProps): JSX.Element => (
  <button
    onClick={() => applyPreset(config)}
    style={{ padding: 20, border: '1px solid black', width: '100%' }}
  >
    {config.name}
  </button>
)

Preset.propTypes = {
  config: PropTypes.shape({
    name: PropTypes.string,
    rng: PropTypes.boolean.optional,
    score: PropTypes.shape({
      cultural: PropTypes.number.optional,
      description: PropTypes.number.optional,
      location: PropTypes.number.optional,
      quality: PropTypes.number.optional,
      safety: PropTypes.number.optional,
      uniqueness: PropTypes.number.optional,
      what: PropTypes.number.optional,
    }),
  }),
}

export const WayfarerUltra = (): JSX.Element => {
  return (
    <div
      style={{
        position: 'sticky',
        display: 'flex',
        top: 0,
        zIndex: 1000,
        backgroundColor: `white`,
        width: '100%',
      }}
    >
      {presets?.map((presetConfig) => (
        <Preset key={presetConfig.name} config={presetConfig} />
      ))}
    </div>
  )
}
