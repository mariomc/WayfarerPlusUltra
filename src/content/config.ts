export type PresetConfigScore = {
  cultural?: number
  description?: number
  location?: number
  quality?: number
  safety?: number
  uniqueness?: number
  what?: number
}

export type PresetScoreKey = keyof PresetConfigScore;

export type Randomizable = {
  cultural?: boolean
  description?: boolean
  location?: boolean
  quality?: boolean
  safety?: boolean
  uniqueness?: boolean
  what?: boolean
}

export type PresetConfig = {
  name: string
  rng?: boolean
  score: PresetConfigScore
}

export const selectors = {
  presets: {
    selected: '.wf-rate__star--selected',
    quality: 'app-should-be-wayspot .wf-rate > li',
    description: 'app-title-and-description .wf-rate > li',
    cultural: 'app-historic-cultural-significance .wf-rate > li',
    uniqueness: 'app-visually-unique .wf-rate > li',
    safety: 'app-safe-access .wf-rate > li',
    location: 'app-location-accuracy .wf-rate > li',
    what: 'TODO',
  },
}

export const randomizable: Randomizable = {
  cultural: true,
  description: true,
  safety: true,
  uniqueness: true,
  location: false,
  quality: false,
  what: false,
}

export const presets:Array<PresetConfig> = [
  {
    name: 'Full 5',
    score: {
      cultural: 5,
      description: 5,
      location: 5,
      quality: 5,
      safety: 5,
      uniqueness: 5,
      what: 5,
    },
  },
  {
    name: '5',
    rng: true,
    score: {
      cultural: 5,
      description: 5,
      location: 5,
      quality: 5,
      safety: 5,
      uniqueness: 5,
      what: 5,
    },
  },
  {
    name: '4',
    rng: true,
    score: {
      cultural: 4,
      description: 4,
      location: 4,
      quality: 4,
      safety: 4,
      uniqueness: 4,
      what: 4,
    },
  },
  {
    name: '3',
    rng: true,
    score: {
      cultural: 3,
      description: 3,
      location: 3,
      quality: 3,
      safety: 3,
      uniqueness: 3,
      what: 3,
    },
  },
  {
    name: '2',
    rng: true,
    score: {
      cultural: 2,
      description: 2,
      location: 2,
      quality: 2,
      safety: 2,
      uniqueness: 2,
      what: 2,
    },
  },
  {
    name: '1',
    score: {
      quality: 1,
    },
  },
]
