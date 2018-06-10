import { appendIdx } from '../../../shared/utils'
import { log } from '../utils'

export default (target, room) => {
  room.listen('containers/:idx', (change) => {
    log('container changed: ', change)
    target.emit('containers.' + change.operation, {
      idx: parseInt(change.path.idx),
      container: appendIdx(change.value, parseInt(change.path.idx)),
    })
  })

  room.listen('containers/:idx/:attribute', (change) => {
    // log(`container ${change.path.id} changed attribute ${change.path.attribute} to ${change.value} (${change.operation})`)
    target.emit('containers.update', {
      idx: parseInt(change.path.idx),
      attribute: change.path.attribute,
      value: change.value,
    })
  })

  room.listen('containers/:idx/children/:childIdx', (change) => {
    // log(`container ${change.path.idx} child change ${change.path.childIdx} (${change.operation})`)
    target.emit(`containers.${change.operation}Child`, {
      idx: parseInt(change.path.idx),
      childIdx: parseInt(change.path.childIdx),
      value: appendIdx(change.value, parseInt(change.path.childIdx)),
    })
  })
}
