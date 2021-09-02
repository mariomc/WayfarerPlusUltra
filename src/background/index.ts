console.log('background script')

document.addEventListener('DOMContentLoaded', () => {
  const head = document.getElementsByTagName('head')[0]
  const setInject = document.createElement('script')
  const WFP = { extensionURL : browser.runtime.getURL("")}
  setInject.innerText =
    'window.WFP=' +
    JSON.stringify(WFP) +
    ';'
  head.appendChild(setInject)
})
