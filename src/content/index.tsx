import React from 'react'
import { render } from 'react-dom'
import { hook } from './hook'
import { WayfarerUltra } from './components/index'

const reactRoot = document.createElement('div')

hook();

document.body.insertBefore(reactRoot, document.body.firstElementChild)

render(<WayfarerUltra />, reactRoot)
