import { Application, Text, interaction } from 'pixi.js'
import Table from './table/table'
import { EventEmitter } from 'eventemitter3'
import { log } from './utils'
import * as colyseus from 'colyseus.js'

import Listeners from './listeners/index'
import { Component } from './component'

export class Game extends EventEmitter {

  app: Application
  room: colyseus.Room
  client: colyseus.Client
  host: string | null
  table: Table

  static width = 600
  static height = 600

  constructor(room, client) {
    super()

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container.
    this.app = new Application(Game.width, Game.height, {
      backgroundColor: 0x1099bb
    })

    // The application will create a canvas element for you that you
    // can then insert into the DOM.
    document.body.appendChild(this.app.view)

    this.app.ticker.stop()
    let lastTime = performance.now()
    setInterval(() => {
      const now = performance.now()
      this.app.ticker.update(now - lastTime)
      lastTime = performance.now()
    }, 1000 / 12)

    this.room = room
    this.client = client
    this.host = null

    this.table = new Table()
    this.table.on('click', (event: interaction.InteractionEvent) => {
      console.info('Table got clicked', event.target)

      // TODO: factory/type for playerEvent - must be the same as on server!
      const playerEvent = {
        // invoker: string       // clientID is already in onMessage method
        eventType: event.type,
        eventTarget: (event.target as Component<any>).id  // ID of target element
        // data?: any            // additional/optional data
      }
      this.room.send(playerEvent)
    })
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
      log(`${this.client.id} joined ${room.name}`)
      // Testing, just init with players
      // room.send({ action: 'GameStart' })
    })

    room.onLeave.add(() => {
      log.info('ON: Leave!')
      room.removeAllListeners()
      room.leave()

      setTimeout(() => {
        document.location.href += ''
      }, 250)
    })

    room.onError.add(() => {
      log.info('ON: Error!')
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

    Listeners.playersListener(this.table, room)
    Listeners.containersListener(this.table, room)
    Listeners.cardsListener(this.table, room)

    room.listen('GameStart', function () {
      log('GameStart!? ', arguments)
    })
  }

  get stage() {
    return this.app.stage
  }
}
