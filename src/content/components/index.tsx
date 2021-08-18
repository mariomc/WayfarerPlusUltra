import React from 'react'
import { Presets } from './presets'
import { presets } from '../config'


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
      <Presets presets={presets} />
    </div>
  )
}
