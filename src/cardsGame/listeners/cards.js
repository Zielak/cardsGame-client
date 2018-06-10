import { appendIdx } from '../../../shared/utils'
import { log } from '../utils'

export default (target, room) => {
  room.listen('cards/:idx', (change) => {
    log('cards => ', change.operation)
    target.emit('cards.' + change.operation, {
      idx: parseInt(change.path.idx),
      card: appendIdx(change.value, parseInt(change.path.idx)),
    })
  })

  room.listen('cards/:idx/:attribute', (change) => {
    // log(`card ${change.path.idx} changed attribute ${change.path.attribute} to ${change.value} (${change.operation})`)
    target.emit('cards.attribute.update', {
      idx: parseInt(change.path.idx),
      attribute: change.path.attribute,
      value: change.value,
    })
  })
}
