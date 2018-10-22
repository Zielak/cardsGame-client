/**
 * Decides where each part of the game should be placed,
 */

import {
  Player,
  Game,
  ClassicCard
} from '..'
import { Deck } from '../containers/deck'
import { Hand } from '../containers/hand'
import { Pile } from '../containers/pile'
import { Row } from '../containers/row'
import { Spread } from '../containers/spread'
import { Component, IProps } from '../component'
import { log } from '../log'

export class Table extends Component<TableProps> {

  containers = new Map<string, Component<any>>()
  cards = new Map<string, ClassicCard>() // TODO: BaseCard instead
  players = new Map<string, Player>()

  constructor() {
    super({
      id: 'table', // There's only one table
      type: 'table',
      name: 'table'
    })

    this.x = Game.width / 2
    this.y = Game.height / 2

    // const testText = new Text('table added!', {
    //   fill: 0xffaa66,
    //   fontSize: 12
    // })
    // testText.x = 5
    // testText.y = 25
    // this.addChild(testText)

    this.preparePlayers()
    this.prepareContainers()
    this.prepareCards()
  }

  preparePlayers() {

    this.on('players.add', data => {
      const newPlayer = new Player(data.player)
      this.players.set(newPlayer.id, newPlayer)
      this.addChild(newPlayer)
      this.updatePlayers()
    })
    this.on('players.remove', data => {
      const player = Component.get(data)
      if (player !== undefined) {
        this.players.delete(player.id)
        this.removeChild(player)
        this.updatePlayers()
      }
    })
    // this.on('players.replace', data => {
    //   const player = getByTypeFromMap('player', this.players)
    //     .find(el => el.idx === data.idx)
    //   if (player !== undefined) {
    //     this.removeChild(player)
    //     this.addChild(new Player(data.player))
    //     this.updatePlayers()
    //   }
    // })
    // this.on('players.update', data => {
    //   // console.log('players.update!', data)
    //   const player = getByTypeFromMap('player', this.players)
    //     .find(el => el.idx === data.idx)
    //   if (player !== undefined) {
    //     player.props[data.attribute] = data.value
    //     this.updatePlayers()
    //   }
    // })
  }

  prepareContainers() {

    const create = <T>(cls: { new(options: any): T }, options: any): T => {
      return new cls(options)
    }

    this.on('containers.add', data => {
      const type = data.container.type
      let newContainer: Component<any>
      switch (type) {
        case 'deck': newContainer = create<Deck>(Deck, data.container); break
        case 'hand': newContainer = create<Hand>(Hand, data.container); break
        case 'pile': newContainer = create<Pile>(Pile, data.container); break
        case 'row': newContainer = create<Row>(Row, data.container); break
        case 'spread': newContainer = create<Spread>(Spread, data.container); break
        default: return
      }

      this.containers.set(newContainer.id, newContainer)
    })
    // this.on('containers.remove', data => {
    //   const container = this.containers.getByType(data.container.type)
    //     .find(el => el.idx === data.idx)

    //   this.containers.remove(player.id)
    //   this.removeChild(player)
    //   this.updatePlayers()
    // })
    // this.on('containers.replace', data => {
    //   const player = this.containers.getByType('player')
    //     .find(el => el.idx === data.idx)
    //   this.removeChild(player)
    //   this.addChild(new Player(data.player))
    //   this.updatePlayers()
    // })
    // this.on('containers.update', data => {
    //   console.log('players.update!', data)
    //   const player = this.containers.getByType('player')
    //     .find(el => el.idx === data.idx)
    //   player.props[data.attribute] = data.value
    //   this.updatePlayers()
    // })
  }

  prepareCards() {
    this.on('cards.add', (data) => {
      // idx: elementID, card
      const card = new ClassicCard(data.card)
      const targetParent = this.getParentContainer(data.card.parentId)
      targetParent.addChild(card)
      this.cards.set(card.id, card)
    })

    this.on('cards.attribute.update', data => {
      // idx: elementID, attribute, value
      // FIXME: something smells here.
      const card = Component.get(data.id)
      if (card) {
        card.props[data.attribute] = data.value
      }
    })

    this.on('cards.parentChange', (data) => {
      log.notice('cards.parentChange', data)
      // const element = Component.get(data.id)
      // const newParent = Component.get(data.parentId)
      // newParent.addChild(element)
    })
  }

  private getParentContainer(parentId: string): Component<any> {
    const result = this.containers.get(parentId)
    if (!parentId || !result) {
      return this
    }
    return result
  }

  updatePlayers() {
    log.notice('updatePlayers()')
    // setTimeout(() =>
    Array.from(this.players.values()).forEach((player: Player, idx: number, players: Player[]) => {
      const angle = Math.PI * 2 / players.length * idx
      const point = {
        x: Math.sin(angle) * (Game.width * 0.4),
        y: Math.cos(angle) * (Game.height * 0.4),
      }
      player.rotation = -angle
      player.props.x = point.x
      player.props.y = point.y
      console.log(`player[${idx}] angle: ${angle}, point:`, point)
    })
    // , 0)
  }

}

interface TableProps extends IProps { }
