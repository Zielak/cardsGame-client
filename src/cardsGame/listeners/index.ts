import cardsListener from './cards'
import containersListener from './containers'
import playersListener from './players'

export const Listeners = {
  cardsListener,
  containersListener,
  playersListener
}

export enum OperationType {
  ADD = "add",
  REMOVE = "remove",
  REPLACE = "replace"
}

export type StatePath = string[]

export type StateChangeEvent = {
  operation: OperationType
  path: {
    attribute?: string
    idx?: string
  }
  rawPath: StatePath
  value: any
}

export const parentChanges = (change: StateChangeEvent) => {
  return (
    change.operation === OperationType.REPLACE &&
    change.path.attribute === 'parentId'
  )
}
