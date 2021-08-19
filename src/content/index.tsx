import React from 'react'
import { render } from 'react-dom'
import { WayfarerUltra } from './components/index'

const reactRoot = document.createElement('div')

console.log("content script");

document.body.insertBefore(reactRoot, document.body.firstElementChild)

render(<WayfarerUltra />, reactRoot)