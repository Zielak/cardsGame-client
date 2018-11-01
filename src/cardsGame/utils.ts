import { Component } from './component'
import Color from 'color'
import md5 from 'md5'

export interface IGameElement {
  parent: string | null
}

/**
 * NUMBERS
 */

/**
 * Gets you random number in provided range
 */
export const float = (min = 0, max = 1) => Math.floor(
  Math.random() * (max - min + 1) + min
)

export const limit = (val: number, min = 0, max = 1) => val < min ? min : val > max ? max : val

export const wrap = (val: number, max = 1) => (val % max + max) % max

export const rad2deg = (angle: number) => {
  //  discuss at: http://locutus.io/php/rad2deg/
  // original by: Enrique Gonzalez
  // improved by: Brett Zamir (http://brett-zamir.me)
  return angle * 57.29577951308232 // angle / Math.PI * 180
}

export const deg2rad = (angle: number) => {
  //  discuss at: http://locutus.io/php/deg2rad/
  // original by: Enrique Gonzalez
  // improved by: Thomas Grainger (http://graingert.co.uk)
  return angle * 0.017453292519943295 // (angle / 180) * Math.PI;
}
export const cm2px = (value: number) => value * 11.5
export const px2cm = (value: number) => value / 11.5

/**
 * STRINGS
 */

export const trim = (string: string = '', maxLength: number = 7) => {
  if (typeof string !== 'string') return
  return string.length <= maxLength ? string :
    string.substr(0, maxLength - 1) + '…'
}

export const keysList = object => Object.keys(object)

/**
 * OBJECTS
 */

export const clone = object => Object.assign({}, object)

/**
 * ELEMENTS FINDING
 */

export const getElementById = (everything, id) => everything.find(el => el.id === id)

export const getParent = (child, everything) => everything.filter(el => {
  return el && el.id === child.parent
})[0]

export const findAllChildren = (parent, everything) => {
  return everything.filter(el => el.parent === parent.id)
}

const arrayWithoutElement = (element, everything) => everything.filter(el => el.id !== element.id)

export const findAllParents = (child, everything) => {
  const result: Array<IGameElement> = []
  if (child.parent) {
    const newParent: IGameElement = getParent(child, everything)
    if (!newParent) {
      return result
    }
    result.unshift(newParent)
    if (newParent.parent) {
      result.unshift(...findAllParents(newParent, arrayWithoutElement(newParent, everything)))
    }
  }
  return result
}

export const getByTypeFromMap = <T extends Component<any>>(type: string, map: Map<string, T>): T[] => {
  const found: T[] = []
  map.forEach((element) => {
    if (element.type === type) {
      found.push(element)
    }
  })
  return found
}

export const getByIdFromMap = <T extends Component<any>>(id: string, map: Map<string, T>): T | undefined => {
  let found: T | undefined
  map.forEach((element) => {
    if (found) return
    if (element.id === id) {
      found = element
    }
  })
  return found
}

/**
 * PROCEDURAL
 */

const string2bytes = (str) => {
  const bytes: Array<number> = []
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    // You can combine both these calls into one,
    // bytes.push(char >>> 8, char & 0xff);
    bytes.push(char >>> 8)
    bytes.push(char & 0xFF)
  }
  return bytes
}

export const procNumberFromString = (str: string, min = 0, max = 1) => {
  str = md5('' + str)
  const bytes = string2bytes(str).filter(value => value !== 0)
  const bMin = bytes.reduce((prev, curr) => {
    return curr < prev ? curr : prev
  }, bytes[0])
  const bMax = bytes.reduce((prev, curr) => {
    return curr > prev ? curr : prev
  }, bytes[0])

  const result = bytes.reduce((prev, curr, idx) => {
    const even = idx % 2 === 0 ? -1 : 1
    const change = curr / 5 * even
    let output = prev + change
    if (output < bMin) {
      output = bMin + (prev - Math.abs(change))
    } else if (output > bMax) {
      output = bMax - (prev - Math.abs(change))
    }
    return limit(output, bMin, bMax)
  }, Math.abs(bMax - bMin) / 2 + bMin)

  const percent = (result - bMin) / Math.abs(bMax - bMin) * Math.abs(min - max) - Math.abs(min)
  return percent
}

export const procColorFromString = (str: string, config: ProcColorConfig = {}) => {
  str = md5('' + str)

  const bytes = string2bytes(str).filter(value => value !== 0)
  const bMin = bytes.reduce((prev, curr) => {
    return curr < prev ? curr : prev
  }, bytes[0])
  const bMax = bytes.reduce((prev, curr) => {
    return curr > prev ? curr : prev
  }, bytes[0])
  const range = bMax - bMin
  bytes.map(num => {
    const perc = (num - bMin) / range
    // console.log(`${perc} = (num[${num}] - bMin[${bMin}]) / range[${range}]`)
    return perc
  })
  // I've got 32 bytes to work with
  const rawH = bytes[0] * bytes[1] + bytes[2] * bytes[3] - bytes[4] * bytes[5] - bytes[6] * bytes[7]
  const randH = Math.floor(wrap(rawH, 360))
  const rawS = bytes[8] * bytes[9] + bytes[10] * bytes[11] - bytes[12] * bytes[13] - bytes[14] * bytes[15]
  const randS = Math.floor(wrap(rawS, 100))
  const rawL = bytes[16] * bytes[17] + bytes[18] * bytes[19] - bytes[20] * bytes[21] - bytes[22] * bytes[23]
  const randL = Math.floor(wrap(rawL, 100))

  const color = new Color().hsl(
    def(limit(randH, def(config.minH, 0), def(config.maxH, 360)), randH),
    def(limit(randS, def(config.minS, 0), def(config.maxS, 100)), randS),
    def(limit(randL, def(config.minL, 0), def(config.maxL, 100)), randL)
  )
  return color
}

type ProcColorConfig = {
  minH?: number
  maxH?: number
  minS?: number
  maxS?: number
  minL?: number
  maxL?: number
}

/**
 * OTHER
 */

/**
 * Returns `def` if the `value` really is undefined
 */
export const def = (value, def) => typeof value !== 'undefined' ? value : def

/**
 * Check if the value exists
 */
export const exists = (value) => typeof value !== 'undefined'

export const noop = () => { }
