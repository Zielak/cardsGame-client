/**
 * Container of cards with loosely placed
 * and slightly rotated cards
 */
import { Graphics, Text } from 'pixi.js'
import { ClassicCard } from '../card/classicCard'
import { IProps } from '../component'
import { procNumberFromString, rad2deg } from '../utils'
import { CContainer } from './container';

const labelText = (children) => `PILE of ${children.length} cards`

export class Pile extends CContainer<PileProps> {

  bg: Graphics
  label: Text

  constructor(props) {
    super(props)
    this.draw()
  }

  componentDidUpdate(props: Set<string>) {
    this.log(`componentDidUpdate ${this.props.type}`)
    if (props.has('childrenIDs')) {
      this.label.text = labelText(this.props.children)
      this.redrawChildren()
    }
  }

  draw() {
    this.bg = new Graphics()
    const radius = Math.max(ClassicCard.width, ClassicCard.height) / 1.5

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawCircle(0, 0, radius)

    this.label = new Text(labelText(this.props.children), {
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 4,
    })
    this.label.x = -this.label.width / 2
    this.label.y = ClassicCard.height / 2

    this.addChild(this.bg)
    this.addChild(this.label)
  }

  redraw() {
    this.label.text = labelText(this.props.children)
  }

  redrawChildren() {
    this.props.children.forEach(Pile.restyleChild)
  }

  static restyleChild = (child, idx/*, length*/) => {
    return {
      x: Math.cos(procNumberFromString(child.id, -1.5, 1.5)),
      y: Math.sin(procNumberFromString(child.id, -1.5, 1.5)),
      angle: rad2deg(procNumberFromString(child.id, -45, 45)),
      // zIndex: idx + 5,
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
