import { appendIdx } from '../../../shared/utils'
import { log } from '../utils'

export default (target, room) => {
  room.listen('players/list/:idx', (change) => {
    // log('player list changed: ', change)
    target.emit('players.' + change.operation, {
      idx: parseInt(change.path.idx),
      player: appendIdx(change.value, parseInt(change.path.idx)),
    })
  })
  room.listen('players/list/:idx/:attribute', (change) => {
    // log('player attrib changed: ', change)
    target.emit('players.update', {
      idx: parseInt(change.path.idx),
      attribute: change.path.attribute,
      value: change.value,
    })
  })
  room.listen('players/reversed', (change) => {
    log('player reversed changed: ', change)
    // target.emit('players.reversed', {})
  })
  room.listen('players/currentPlayerIdx', (change) => {
    log('player currentPlayerIdx changed: ', change)
    // target.emit('players.currentPlayerIdx', {})
  })
  room.listen('players/currentPlayer', (change) => {
    log('player currentPlayer changed: ', change)
    // target.emit('players.currentPlayer', {})
  })
}
