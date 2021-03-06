import { log } from '../log'

export default (target, room) => {

  room.listen('players/:idx', (change) => {
    // log('player list changed: ', change)
    target.emit('players.' + change.operation, {
      idx: parseInt(change.path.idx),
      player: change.value,
    })
  })
  room.listen('players/:idx/:attribute', (change) => {
    // log('player attrib changed: ', change)
    target.emit('players.update', {
      idx: parseInt(change.path.idx),
      attribute: change.path.attribute,
      value: change.value,
    })
  })
  room.listen('players/reversed', (change) => {
    log.verbose('player reversed changed: ', change)
    // target.emit('players.reversed', {})
  })
  room.listen('players/currentPlayerIdx', (change) => {
    log.verbose('player currentPlayerIdx changed: ', change)
    // target.emit('players.currentPlayerIdx', {})
  })
  room.listen('players/currentPlayer', (change) => {
    log.verbose('player currentPlayer changed: ', change)
    // target.emit('players.currentPlayer', {})
  })
}
