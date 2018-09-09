import { Game } from '../cardsGame/index'
import { IProps } from '../cardsGame/component';

class WarGame extends Game {

  constructor(room, client) {
    super(room, client)
  }

  storeToTable() {

  }
}

// TODO: Why did I needed that???
interface IWarGameProps extends IProps {
  testDealHandler: () => void,

  players: any,
  cards: [],
  containers: [],
  room: any,

  host: string,
}

export default WarGame
