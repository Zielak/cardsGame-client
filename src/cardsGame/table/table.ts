import { Text } from 'pixi.js'
import {
  Player,
  Game,
  ClassicCard
} from '..'
import { Deck } from '../containers/deck'
import { Pile } from '../containers/pile'
import { Hand } from '../containers/hand'
import { Component, IProps } from '../component'
import { getByTypeFromMap, getByIdFromMap } from '../utils'
import { IContainer } from '../containers/container'

/**
 * Decides where each part of the game should be placed,
 * RWD
 */
// import PropTypes from 'prop-types'
/*
import { rotateDEG, translate, transform, identity } from 'transformation-matrix'

// import ClassicCard from '../card/classicCard'
import {
  // findAllParents,
  findAllChildren,
  def,
} from '../utils.js'

// import Player from '../player/player'
import Deck from '../containers/deck/deck'
import Pile from '../containers/pile/pile'
import Hand from '../containers/hand/hand'
*/

// TODO: align angle to the current player
// const startingAngle = 90

// const getOwnerId = (element) => {
//   if (element.parent) {
//     return getOwnerId(element.parent)
//   } else {
//     return element
//   }
// }

/**
 *
 * @param {Player} player
 * @param {*} idx
 * @param {*} players
 */
const positionPlayers = (player, idx, players) => {
  const angle = Math.PI * 2 / players.length * idx
  const point = {
    x: Game.width / 2 + Math.sin(angle) * (Game.width * 0.4),
    y: Game.height / 2 + Math.cos(angle) * (Game.height * 0.4),
  }
  player.rotation = -angle
  player.x = point.x
  player.y = point.y
}

/*
const addRenderingProps = (element) => {
  return {
    ...element,
    x: def(element.x, 0),
    y: def(element.y, 0),
    angle: def(element.angle, 0),
    zIndex: def(element.zIndex, 0),
  }
}

const addTransformForPlayers = (player, idx, players) => {
  const angle = 360 / players.length * idx
  return {
    ...player,
    localTransform: transform([
      identity(),
      translate(50, 50),
      rotateDEG(angle),
      translate(0, 40),
    ]),
    angle,
  }
}

const addLocalTransform = (element) => {
  if (element.localTransform) {
    return element
  }
  return {
    ...element,
    localTransform: transform([
      identity(),
      rotateDEG(element._local.angle),
      element.parent ? identity() : translate(50, 50),
      translate(element._local.x, element._local.y),
    ]),
    angle: element._local.angle,
  }
}

const parentTransforms = {
  deck: Deck.restyleChild,
  hand: Hand.restyleChild,
  pile: Pile.restyleChild,
}

const applyParentTransform = (element, idx, everything) => {
  // This method is only for parents
  if (!element.children || element.children.length === 0 || !parentTransforms[element.type]) {
    return element
  }

  findAllChildren(element, everything)
    .map(child => {
      // Add current idx in the parent's array
      child._sortIdx = element.children.indexOf(child.id)
      return child
    })
    .sort((a, b) => a._sortIdx - b._sortIdx)
    .map(child => {
      delete child._sortIdx
      return child
    })
    .map((child, idx, allChildren) => {
      const newTransform = parentTransforms[element.type](child, idx, allChildren.length)

      child.localTransform = transform([
        child.localTransform,
        rotateDEG(def(newTransform.angle, 0)),
        translate(def(newTransform.x, 0), def(newTransform.y, 0))
      ])
      child.angle += def(newTransform.angle, 0)
      child.zIndex += def(newTransform.zIndex, 0)
    })
  return element
}*/

// const playerIdx = (idx) => (player) => player.idx === idx

class Table extends Component<TableProps> {

  containers = new Map<string, Component<any>>()
  // TODO: Cards could be non-standard... modularise it some day.
  cards = new Map<string, ClassicCard>()
  players = new Map<string, Player>()

  constructor() {
    super({
      id: 'table',
      type: 'table'
    })

    this.x = Game.width / 2
    this.y = Game.height / 2

    const testText = new Text('table added!', {
      fill: 0xffaa66,
      fontSize: 12
    })
    testText.x = 5
    testText.y = 25
    this.addChild(testText)

    this.name = 'table'

    this.preparePlayers()
    this.prepareContainers()
    this.addCardsListeners()
  }

  preparePlayers() {
    // this.players = new Container()
    // this.addChild(this.players)

    this.on('players.add', data => {
      const newPlayer = new Player(data.player)
      this.players.set(newPlayer.id, newPlayer)
      this.addChild(newPlayer)
      this.updatePlayers()
    })
    this.on('players.remove', data => {
      const player = getByTypeFromMap('player', this.players)
        .find(el => el.idx === data.idx)
      if (player !== undefined) {
        this.players.delete(player.id)
        this.removeChild(player)
        this.updatePlayers()
      }
    })
    this.on('players.replace', data => {
      const player = getByTypeFromMap('player', this.players)
        .find(el => el.idx === data.idx)
      if (player !== undefined) {
        this.removeChild(player)
        this.addChild(new Player(data.player))
        this.updatePlayers()
      }
    })
    this.on('players.update', data => {
      // console.log('players.update!', data)
      const player = getByTypeFromMap('player', this.players)
        .find(el => el.idx === data.idx)
      if (player !== undefined) {
        player.props[data.attribute] = data.value
        this.updatePlayers()
      }
    })
  }

  prepareContainers() {

    const create = <T>(cls: { new(options: any): T }, options: any): T => {
      return new cls(options)
    }

    this.on('containers.add', data => {
      const type = data.container.type
      let newContainer
      switch (type) {
        case 'deck': newContainer = create<Deck>(Deck, data.container); break
        case 'pile': newContainer = create<Pile>(Pile, data.container); break
        case 'hand': newContainer = create<Hand>(Hand, data.container); break
      }

      this.containers.set(newContainer.id, newContainer)

      const parent = getByIdFromMap(newContainer.parentId, this.containers) || this
      parent.addChild(newContainer)
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

  addCardsListeners() {
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
      const card = getByIdFromMap(data.idx, this.cards)
      if (card) {
        card.props[data.attribute] = data.value
      }
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
    this.players.forEach(positionPlayers)
  }

}

interface TableProps extends IProps { }

export default Table
