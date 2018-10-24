import { log } from '../log'
import { StateChangeEvent } from '.'
import { trim } from '../utils'

export default (target, room) => {

  room.listen('containers/:idx', (change: StateChangeEvent) => {
    log.verbose('container changed: ', change)
    target.emit('containers.' + change.operation, {
      idx: parseInt(change.path.idx),
      container: change.value,
    })
  })

  room.listen('containers/:idx/:attribute', (change: StateChangeEvent) => {
    log.verbose(`container ${trim(change.path.idx)} ${change.operation}ed attribute ${change.path.attribute} to ${change.value}`)
    target.emit('containers.update', {
      idx: parseInt(change.path.idx),
      attribute: change.path.attribute,
      value: change.value,
    })
  })

  room.listen('containers/:idx/childrenIDs/:childIdx', (change: StateChangeEvent) => {
    log.verbose(`container ${trim(change.path.idx)} child change ${change.path.childIdx} (${change.operation})`)
    target.emit(`containers.${change.operation}Child`, {
      idx: parseInt(change.path.idx),
      childIdx: parseInt(change.path.childIdx),
      value: change.value,
    })
  })
}
