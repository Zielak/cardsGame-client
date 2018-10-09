import * as utils from '../utils'

describe(`float`, () => {
  test(`default min/max`, () => {
    const result = utils.float()
    expect(result).toBeLessThanOrEqual(1)
    expect(result).toBeGreaterThanOrEqual(0)
  })
  test(`lower min value (1 arg)`, () => {
    const result = utils.float(-1000)
    expect(result).toBeLessThanOrEqual(1)
    expect(result).toBeGreaterThanOrEqual(-1000)
  })
  test(`min/max lower values`, () => {
    const result = utils.float(-10, -1)
    expect(result).toBeLessThanOrEqual(-1)
    expect(result).toBeGreaterThanOrEqual(-10)
  })
  test(`min/max higher values`, () => {
    const result = utils.float(100, 200)
    expect(result).toBeLessThanOrEqual(200)
    expect(result).toBeGreaterThanOrEqual(100)
  })
})

describe(`limit`, () => {
  test(`in default range`, () => {
    const result = utils.limit(0.5)
    expect(result).toBe(0.5)
  })
  test(`default, limit bottom`, () => {
    const result = utils.limit(-5)
    expect(result).toBe(0)
  })
  test(`default limit top`, () => {
    const result = utils.limit(5)
    expect(result).toBe(1)
  })

  test(`in bigger range`, () => {
    const result = utils.limit(10, 5, 50)
    expect(result).toBe(10)
  })
  test(`bigger range, limits bottom`, () => {
    const result = utils.limit(0, 20, 30)
    expect(result).toBe(20)
  })
  test(`bigger range, limits top`, () => {
    const result = utils.limit(Infinity, -100, 100)
    expect(result).toBe(100)
  })
})
