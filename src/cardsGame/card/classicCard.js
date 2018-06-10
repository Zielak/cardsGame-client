import { Graphics, Text } from 'pixi.js'
import Component from '../component'
import PropTypes from 'prop-types'

class ClassicCard extends Component {

  constructor(props) {
    super()
    this.props = props

    this.draw()
  }

  get _componentName() {
    return 'ClassicCard'
  }

  draw() {
    this.bg = new Graphics()

    this.bg.beginFill(0xFFFFFF, 1)
    this.bg.drawRoundedRect(
      -ClassicCard.width / 2,
      -ClassicCard.height / 2,
      ClassicCard.width,
      ClassicCard.height,
      8
    )
    this.rank = new Text(
      this.getRankText(this.props.rank),
      this.getRankStyle(this.props.rank)
    )
    this.suit = new Text(
      this.getSuitText(this.props.suit),
      this.getSuitStyle(this.props.suit)
    )

    this.addChild(this.bg)
    this.addChild(this.rank)
    this.addChild(this.suit)
  }

  redraw() {
    this.rank.text = this.getRankText(this.props.rank)
    this.rank.style = this.getRankStyle(this.props.rank)

    this.suit.text = this.getSuitText(this.props.suit)
    this.suit.style = this.getSuitStyle(this.props.suit)

    this.rank.visible = this.suit.visible = this.props.state.faceUp
  }

  getRankText(rank) {
    return rank
  }

  getSuitText(suit) {
    switch (suit) {
    case 'D': return '♦'
    case 'C': return '♣'
    case 'H': return '♥'
    case 'S': return '♠'
    }
  }

  getRankStyle() {
    return {
      fill: '#000000',
    }
  }

  getSuitStyle(suit) {
    switch (suit) {
    case 'D': return { fill: ['#66ccff', '#0066ff'] }
    case 'C': return { fill: ['#66ff66', '#00ff00'] }
    case 'H': return { fill: ['#ff6666', '#ff0000'] }
    case 'S': return { fill: ['#666666', '#000000'] }
    }
  }

}

ClassicCard.width = 6.35
ClassicCard.height = 8.89

ClassicCard.propTypes = {
  id: PropTypes.string,
  parentId: PropTypes.string,

  localTransform: PropTypes.object,

  x: PropTypes.number,
  y: PropTypes.number,
  angle: PropTypes.number,
  zIndex: PropTypes.number,

  name: PropTypes.string,
  suit: PropTypes.string,
  rank: PropTypes.any,

  state: PropTypes.shape({
    faceUp: PropTypes.bool,
    rotated: PropTypes.number,
    marked: PropTypes.bool,
  }),

  interactionHandler: PropTypes.func,
}

export default ClassicCard
