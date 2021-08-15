export const selectors = {
  presets: {
    quality: 'app-should-be-wayspot .wf-rate > li',
    description: 'app-title-and-description .wf-rate > li',
    cultural: 'app-historic-cultural-significance .wf-rate > li',
    uniqueness: 'app-visually-unique .wf-rate > li',
    safety: 'app-safe-access .wf-rate > li',
    location: 'app-location-accuracy .wf-rate > li',
  },
}

export const randomizable = {
  cultural: true,
  description: true,
  safety: true,
  uniqueness: true,
  location: false,
}

export const presets = [
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
