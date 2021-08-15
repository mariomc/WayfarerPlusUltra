import { render } from 'react-dom'
import { WayfarerUltra } from './components'

const reactRoot = document.createElement('div')

console.log(document.body.firstElementChild)
document.body.insertBefore(reactRoot, document.body.firstElementChild)

render(WayfarerUltra, reactRoot)

console.log('content script 2')
