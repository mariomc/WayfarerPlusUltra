import { randomizable, selectors, PresetConfig, PresetScoreKey } from './config'

function keepInBounds(val: number): number {
  if (val > 5) return 5
  if (val < 1) return 1
  return val
}

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getScore = (
  presetConfig: PresetConfig,
  key: PresetScoreKey,
): number => {
  const shouldRandomize = presetConfig.rng && randomizable[key]
  const delta = shouldRandomize ? randomRange(-1, 1) : 0

  return keepInBounds((presetConfig.score[key] || 0) + delta)
}

const getElement = (key: PresetScoreKey, index: number): HTMLElement | null => {
  const elements = document.querySelectorAll(selectors.presets[key])
  return elements?.[index] as HTMLElement
}

export const applyPreset = (presetConfig: PresetConfig): void => {
  Object.keys(presetConfig.score).forEach((key) => {
    const score = getScore(presetConfig, key as PresetScoreKey)
    const scoreIndex = score - 1
    getElement(key as PresetScoreKey, scoreIndex)?.click()
  })
}
