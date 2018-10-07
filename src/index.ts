import { Client } from 'colyseus.js'

// import Lobby from './lobby/index'
// import WarGame from './warGame/index'
import { Game } from './cardsGame'

// === === === === === === == = -

const host = window.document.location.host.replace(/:.*/, '')
const client = new Client('ws://' + host + (location.port ? ':' + 2657 : ''))

client.onOpen.add(() => {
  const gameRoom = client.join('ContainersTest')
  window['game'] = new Game(gameRoom, client)
})
