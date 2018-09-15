import { log } from '../utils'

export default (target, room) => {
  room.listen('cards/:idx', (change) => {
    log('cards => ', change.operation)
    target.emit('cards.' + change.operation, {
      idx: change.path.idx,
      card: change.value,
    })
  })

  room.listen('cards/:idx/:attribute', (change) => {
    // log(`card ${change.path.idx} changed attribute ${change.path.attribute} to ${change.value} (${change.operation})`)
    target.emit('cards.attribute.update', {
      idx: change.path.idx,
      attribute: change.path.attribute,
      value: change.value,
    })
  })
}
