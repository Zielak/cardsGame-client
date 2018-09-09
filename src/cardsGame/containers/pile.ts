/**
 * Container of cards with loosely placed
 * and slightly rotated cards
 */
import { Graphics, Text } from 'pixi.js'
import { ClassicCard } from '../card/classicCard'
import { Component, IProps } from '../component'
import { procNumberFromString } from '../utils'

const labelText = (children) => `PILE of ${children.length} cards`

export class Pile extends Component<PileProps> {

  bg: Graphics
  label: Text

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

  static restyleChild = (child, idx/*, length*/) => {
    return {
      x: Math.cos(procNumberFromString(child.id, -2, 2)),
      y: Math.sin(procNumberFromString(child.id, -2, 2)),
      angle: procNumberFromString(child.id, -45, 45),
      zIndex: idx + 5,
    }
  }
}

interface PileProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
