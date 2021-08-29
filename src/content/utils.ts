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

export const getFilledInValue = (key: PresetScoreKey): number => {
  const filledInStars = document.querySelectorAll(
    `${selectors.presets[key]}${selectors.presets.selected}`,
  )
  return filledInStars.length
}

export const MIN_WAIT_TIME = 1_000 * 20 // 20 Seconds
export const VARIANCE_TIME = 1_000 * 10 // 10 Seconds
export const MAX_REVIEW_TIME = 1_000 * 60 * 20 // 20 minutes

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getWaitingTime = (
  targetTime: number,
  currentTime: number = new Date().valueOf(),
  randomVariance: number = randomInteger(0, VARIANCE_TIME),
  minWaitTime: number = MIN_WAIT_TIME,
  maxReviewTime: number = MAX_REVIEW_TIME,
): number => {
  const initialTime = targetTime - maxReviewTime
  const safeLowestTime = initialTime + minWaitTime + randomVariance
  const deltaToSafety = safeLowestTime - currentTime

  if (deltaToSafety <= 0) {
    // After the safe window. No need to wait
    return 0
  }

  return deltaToSafety
}
