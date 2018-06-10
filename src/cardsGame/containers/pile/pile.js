/**
 * Container of cards with loosely placed
 * and slightly rotated cards
 */
/**
 * Container of neatly packed cards in one column.
 */
import { Graphics, Text } from 'pixi.js'
import PropTypes from 'prop-types'
import ClassicCard from '../../card/classicCard'
import Component from '../../component'
import { procNumberFromString } from '../../../../shared/utils'

const labelText = (children) => `PILE of ${children.length} cards`

class Pile extends Component {

  constructor(props) {
    super(props)

    this.draw()
  }

  draw() {
    this.bg = new Graphics()
    const radius = Math.max(ClassicCard.width, ClassicCard.height) / 2

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawCircle(0, 0, radius)
    this.label = new Text(labelText(this.props.children), {
      fill: ['#ffffff', '#00ff99'],
      stroke: '#ff6600',
      strokeThickness: 1,
    })

    this.addChild(this.bg)
    this.addChild(this.label)
  }

  redraw() {
    this.label.text = labelText(this.props.children)
  }
}

Pile.restyleChild = (child, idx/*, length*/) => {
  return {
    x: Math.cos(procNumberFromString(child.id, -2, 2)),
    y: Math.sin(procNumberFromString(child.id, -2, 2)),
    angle: procNumberFromString(child.id, -45, 45),
    zIndex: idx + 5,
  }
}

Pile.propTypes = {
  id: PropTypes.string,
  children: PropTypes.array,

  localTransform: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  angle: PropTypes.number,
  zIndex: PropTypes.number,
}

export default Pile
