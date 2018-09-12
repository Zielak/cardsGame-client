import { Client } from 'colyseus.js'

// import Lobby from './lobby/index'
import WarGame from './warGame/index'

// === === === === === === == = -

const host = window.document.location.host.replace(/:.*/, '')
const client = new Client('ws://' + host + (location.port ? ':' + 2657 : ''))

client.onOpen.add(() => {
  const gameRoom = client.join('WarGame')
  window['game'] = new WarGame(gameRoom, client)
})
