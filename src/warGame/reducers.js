import {
  Player,
  Game // eslint-disable-line no-unused-vars
} from '../cardsGame/index'

// TODO: Those reducers are not even used anymore.

/**
 * @param {Game} game 
 */
module.exports.players = (game) => (state, action) => {
  let newList
  if (state === undefined) {
    return {
      list: [],
      reversed: false,
      currentPlayerIdx: 0,
      currentPlayer: null,
    }
  }
  switch (action.type) {
  case 'players.add':
    newList = [...state.list]
    newList[action.data.idx] = new Player(action.data.player)
    game.table.players.addChild(newList[action.data.idx])
    return {
      ...state,
      list: [...newList]
    }
  case 'players.remove':
    game.table.players.removeChild(state.list[action.data.idx])
    return {
      ...state,
      list: [
        ...state.list.slice(0, action.data.idx),
        ...state.list.slice(action.data.idx + 1)
      ]
    }
  case 'players.replace':
    return {
      ...state,
      list: state.list.map(player => {
        if (action.data.idx !== player.idx) {
          game.table.players.removeChild(state.list[action.data.idx])
          return player
        }
        return {
          ...player,
          name: action.data.player.name
        }
      })
    }
    // case 'players.update':
    //   return {
    //     ...state,
    //     list: state.list.map(player => {
    //       if(player.id === action.data.player.id){
    //         return {
    //           ...player,
    //           ...action.data.player
    //         }
    //       } else {
    //         return player
    //       }
    //     })
    //   }
  case 'players.reversed':
    return {
      ...state,
      reversed: action.data.player
    }
  default:
    return state
  }
}

/**
 * @param {Game} game 
 */
module.exports.containers = (game) => (state = [], action) => {
  game
  let newState
  switch (action.type) {
  case 'containers.add':
    newState = [...state]
    newState[action.data.idx] = action.data.container
    return [...newState]
  case 'containers.remove':
    return [
      ...state.slice(0, action.data.idx),
      ...state.slice(action.data.idx + 1)
    ]
  case 'containers.replace':
    return state.map(container => {
      if (action.data.idx !== container.idx) {
        return container
      }
      return {
        ...container
      }
    })
  case 'containers.update':
    return state.map((container, idx) => {
      if (idx !== action.data.idx) {
        return container
      }
      const newContainer = { ...container }
      newContainer[action.data.attribute] = action.data.value
      return newContainer
    })
  case 'containers.addChild':
    return state.map((container, idx) => {
      if (idx !== action.data.idx) {
        return container
      }
      newState = [...container.children]
      newState[action.data.childIdx] = action.data.value
      return {
        ...container,
        children: [...newState],
      }
    })
  case 'containers.removeChild':
    return state.map((container, idx) => {
      if (idx !== action.data.idx) {
        return container
      }
      newState = [...container.children]
      newState[action.data.childIdx] = action.data.value
      return {
        ...container,
        children: newState,
        // children: [
        //   ...container.children.slice(0, action.data.childIdx),
        //   ...container.children.slice(action.data.childIdx + 1)
        // ]
      }
    })
  default:
    return state
  }
}

/**
 * @param {Game} game 
 */
module.exports.cards = (game) => (state = [], action) => {
  game
  let newState
  switch (action.type) {
  case 'cards.add':
    newState = [...state]
    newState[action.data.idx] = action.data.card
    return newState
  case 'cards.remove':
    return [
      ...state.slice(0, action.data.idx),
      ...state.slice(action.data.idx + 1)
    ]
  case 'cards.replace':
    return state.map(card => {
      if (action.data.idx !== card.idx) {
        return card
      }
      return {
        ...action.data.card
      }
    })
  case 'cards.update':
    return state.map((card, idx) => {
      if (idx !== action.data.idx) {
        return card
      }
      const newCard = { ...card }
      newCard[action.data.attribute] = action.data.value
      return newCard
    })
  default:
    return state
  }
}

/**
 * @param {Game} game 
 */
module.exports.host = (game) => (state = null, action) => {
  game
  action.type === 'host.add'
  switch (action.type) {
  case 'host.add':
  case 'host.replace':
    return action.data
  default:
    return state
  }
}

/**
 * @param {Game} game 
 */
module.exports.gameState = (game) => (state = {}/*, action*/) => {
  game
  if (state === undefined) {
    return {
      started: false,
    }
  } else {
    return state
  }
}
