import { Application, Text } from 'pixi.js'
import Table from './table/table'
import EventEmitter from 'eventemitter3'
import { log } from './utils'

import {
  cardsListener,
  containersListener,
  playersListener,
} from './listeners/index'

class Game extends EventEmitter {
  constructor(room, client) {
    super()

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container.
    this.app = new Application(Game.width, Game.height, { backgroundColor: 0x1099bb })

    // The application will create a canvas element for you that you
    // can then insert into the DOM.
    document.body.appendChild(this.app.view)

    this.room = room
    this.client = client
    this.host = null

    this.table = new Table()
    this.app.stage.addChild(this.table)

    const testText = new Text('Testing!', {
      fill: 0xffffff,
      fontSize: 12
    })
    testText.x = 5
    testText.y = 5
    this.app.stage.addChild(testText)

    this.serverListeners()
  }

  serverListeners() {
    const room = this.room

    room.onJoin.add(() => {
      log(this.client.id, 'joined', room.name)
      // Testing, just init with players
      room.send({ action: 'GameStart' })
    })

    room.onLeave.add(() => {
      console.info('ON: Leave!')
      room.removeAllListeners()
      room.leave()

      setTimeout(() => {
        document.location.href += ''
      }, 250)
    })

    room.onError.add(() => {
      console.info('ON: Error!')
    })

    // =======================

    room.onStateChange.addOnce(state => {
      log('initial lobby data:', state)
      /*state.clients.forEach((el, idx) => this.store.dispatch({
        type: 'clients.add',
        data: {
          idx, name: el
        },
      }))
      this.store.dispatch({
        type: 'host.set',
        data: state.host,
      })*/
    })

    // room.onStateChange.add(state => {
    //   log('UPDATE', state)
    //   // updateCallback.call(null, this.store.getState)
    // })

    // listen to patches coming from the server
    room.listen('clients/:number', (change) => {
      log('new client change arrived: ', change)
      /*this.store.dispatch({
        type: 'clients.' + change.operation,
        data: {
          idx: parseInt(change.path.number),
          name: change.value,
        }
      })*/
    })

    room.listen('host', (change) => {
      log('host changed: ', change)
      this.host = change.value
    })

    playersListener(this.table, room)
    containersListener(this.table, room)
    cardsListener(this.table, room)

    room.listen('GameStart', () => {
      log('GameStart!? ', arguments)
    })
  }

  get stage() {
    return this.app.stage
  }
}

Game.width = 600
Game.height = 600

export default Game
