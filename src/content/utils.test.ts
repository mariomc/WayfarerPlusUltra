import {
  getScore,
  getWaitingTime,
  MIN_WAIT_TIME,
  MAX_REVIEW_TIME,
} from './utils'

test('getScore should be defined', () => {
  expect(getScore).toBeDefined()
})

test('getScore result should be defined', () => {
  expect(
    getScore({ name: 'test', score: { location: 2 } }, 'location'),
  ).toBeDefined()
})

test('getWaitingTime should be defined', () => {
  expect(getWaitingTime).toBeDefined()
})

// test('getWaitingTime result should be defined', () => {
//   expect(
//     getWaitingTime(1000),
//   ).toBeDefined()
// })

test.each([
  { currentTime: 0, targetTime: MAX_REVIEW_TIME, expected: MIN_WAIT_TIME }, // Before safe zone 1
  {
    currentTime: 100,
    targetTime: MAX_REVIEW_TIME,
    expected: MIN_WAIT_TIME - 100,
  }, // Before safe zone 2
  {
    currentTime: 1000,
    targetTime: MAX_REVIEW_TIME,
    expected: MIN_WAIT_TIME - 1000,
  }, // Before safe zone 3
  {
    currentTime: MIN_WAIT_TIME,
    targetTime: MAX_REVIEW_TIME,
    expected: 0,
  }, // Inside safe zone 1
  {
    currentTime: MIN_WAIT_TIME + 1000,
    targetTime: MAX_REVIEW_TIME,
    expected: 0,
  }, // Inside safe zone 2
])(
  'getWaitingTime($currentTime, $targetTime)',
  ({ currentTime, targetTime, expected }) => {
    expect(getWaitingTime(targetTime, currentTime, 0)).toBe(expected)
  },
)
