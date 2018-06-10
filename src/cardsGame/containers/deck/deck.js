/**
 * Container of neatly packed cards in one column.
 */
import { Text, Graphics } from 'pixi.js'
import PropTypes from 'prop-types'
import ClassicCard from '../../card/classicCard'
import Component from '../../component'

const labelText = (children) => `DECK of ${children.length} cards`

class Deck extends Component {

  constructor(props) {
    super(props)
    this.draw()
  }

  draw() {
    this.bg = new Graphics()

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawRoundedRect(
      -ClassicCard.width / 2,
      -ClassicCard.height / 2,
      ClassicCard.width,
      ClassicCard.height,
      8
    )
    this.label = new Text(labelText(this.props.children), {
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 5,
    })

    this.addChild(this.bg)
    this.addChild(this.label)
  }

  redraw() {
    this.label.text = labelText(this.props.children)
  }

  componentDidUpdate() {
    this.redraw()
  }

}

Deck.restyleChild = (child, idx/*, length*/) => {
  return {
    x: idx * .1,
    y: -idx * .1,
    angle: 0,
    zIndex: idx + 5,
  }
}

Deck.propTypes = {
  id: PropTypes.string,
  children: PropTypes.array,

  localTransform: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  angle: PropTypes.number,
  zIndex: PropTypes.number,
}

export default Deck
