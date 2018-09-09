/**
 * Container of neatly packed cards in one column.
 */
import { Text, Graphics } from 'pixi.js'
import { ClassicCard } from '../card/classicCard'
import { Component, IProps } from '../component'
import { IContainer } from './container'

const labelText = (children) => `DECK of ${children.length} cards`

export class Deck extends Component<DeckProps> implements IContainer {

  bg: Graphics
  label: Text

  constructor(props: DeckProps) {
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

  static restyleChild(child, idx/*, length*/) {
    return {
      x: idx * .1,
      y: -idx * .1,
      angle: 0,
      zIndex: idx + 5,
    }
  }

}

interface DeckProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
