import { randomizable, selectors } from './config'

export interface PresetConfigScore {
    cultural?: number;
    description?: number;
    location?: number;
    quality?: number;
    safety?: number;
    uniqueness?: number;
    what?: number;
}

export type PresetScoreKey = keyof PresetConfigScore;

export interface PresetConfig {
    name: string;
    rng?: boolean;
    score: PresetConfigScore;
}

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

  return keepInBounds(presetConfig.score[key] + delta)
}


export const applyPreset = (presetConfig:PresetConfig): undefined => {
  Object.keys(presetConfig.score).forEach((key) => {
    const score = getScore(presetConfig, key)
    const scoreIndex = score - 1
    document.querySelectorAll(selectors.presets[key])?.[scoreIndex]?.click()
  })
}