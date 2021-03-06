import { log } from '../log'
import { StateChangeEvent, parentChanges } from '.'
import { Component } from '../component'

export default (target: Component<any>, room) => {
  room.listen('cards/:idx', (change: StateChangeEvent) => {
    log.verbose(`cards => ${change.operation}`, change.value)
    target.emit('cards.' + change.operation, {
      idx: change.path.idx,
      card: change.value,
    })
  })

  room.listen('cards/:idx/:attribute', (change: StateChangeEvent) => {
    // log(`card ${change.path.idx} changed attribute ${change.path.attribute} to ${change.value} (${change.operation})`)

    // Always emit generic event, props shall get updated with it
    target.emit('cards.attribute.update', {
      id: change.path.idx,
      attribute: change.path.attribute,
      value: change.value,
    })

    if (parentChanges(change)) {
      target.emit('cards.parentChange', {
        id: change.path.idx,
        parentId: change.value
      })
    }
  })
}
