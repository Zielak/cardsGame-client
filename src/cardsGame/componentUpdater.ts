import { Component } from './component'
import { log } from './log'

const LOG_PREFIX = '[updater] - '

const countParents = (comp: Component<any>, parentLevel: number = 0): number => {
  if (!comp.props.parentId) {
    return parentLevel
  } else {
    const parentComponent = Component.get(comp.props.parentId)
    return countParents(parentComponent, ++parentLevel)
  }
}

const orderOfUpdate = (comp: Component<any>): number => {
  const parent = comp.parent as Component<any>
  if (parent === null || !parent.props) {
    return 0
  }
  let initialOrder = parent ?
    parseInt(parent.props.id) : 0
  return countParents(comp, initialOrder)
}

let isPending = false
const isScheduled = () => scheduledUpdates.size > 0
let updaterId: null | number | NodeJS.Timer

// Holds stuff to update now or later
// pendingUpdates - if not emepty, it's currently "pending", no new stuff should appear here
// schedulesUpdates - planned for later update
const pendingUpdates = new Set<Component<any>>()
const scheduledUpdates = new Set<Component<any>>()

const scheduleTimeout = () => {
  // Schedule only one updater
  // if (updaterId) {
  //   log.verbose(LOG_PREFIX + 'clearing last timeout')
  //   clearTimeout(updaterId)
  // }
  isPending = true
  log.notice(LOG_PREFIX + `scheduling update`)
  updaterId = setTimeout(() => {
    // Move to pendingUpdates
    scheduledUpdates.forEach(comp => pendingUpdates.add(comp))
    scheduledUpdates.clear()

    const arr = Array.from(pendingUpdates.values())
      .sort((compA, compB) => {
        return orderOfUpdate(compB) - orderOfUpdate(compA)
      })

    log.notice(LOG_PREFIX + `will update ${pendingUpdates.size} things`)
    log.verbose(LOG_PREFIX, [].concat(arr).map((comp: Component<any>) => {
      return {
        what: `[${comp.type}] ${comp.props.name}`,
        props: Array.from(comp._updatedProps.values())
      }
    }))

    arr.forEach(comp => {
      comp._preComponentDidUpdate.call(comp, comp._updatedProps)
      comp._updatedProps.clear()
    })
    isPending = false
    pendingUpdates.clear()

    log.notice(LOG_PREFIX + ` -== == everything updated == ==-`)

    // Restart if something came in the mean time
    if (scheduledUpdates.size > 0) {
      scheduleTimeout()
    }
  }, 1000)
}

export const scheduleUpdate = (comp: Component<any>) => {
  log.verbose(LOG_PREFIX, `adding component ${comp.props.name}`)
  scheduledUpdates.add(comp)
  if (!isPending) {
    scheduleTimeout()
  }
}
