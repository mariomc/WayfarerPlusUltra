import { getScore } from './utils'

test('getScore should be defined', () => {
  expect(getScore).toBeDefined()
})

test('getScore should be defined', () => {
  expect(
    getScore({ name: 'test', score: { location: 2 } }, 'location'),
  ).toBeDefined()
})
