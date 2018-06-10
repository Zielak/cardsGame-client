import PropTypes from 'prop-types'
// import { Container } from 'pixi.js'

import {
  Game
} from '../cardsGame/index'

class WarGame extends Game {

  constructor(room, client) {
    super(room, client)
  }

  storeToTable() {

  }
}

WarGame.propTypes = {
  testDealHandler: PropTypes.func,

  players: PropTypes.object,
  cards: PropTypes.array,
  containers: PropTypes.array,
  room: PropTypes.object,

  host: PropTypes.string,
}

export default WarGame
